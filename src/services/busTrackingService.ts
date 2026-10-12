import { store } from './store';
import { DelayDetectionService } from './delayDetectionService';
import { NotificationItem } from '../types';

// Haversine formula to compute distance in meters between two lat/lng coordinates
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Track proximity alert thresholds already triggered for student pickup stops
// Key: `${studentId}_${stopId}_${threshold}` -> boolean
const proximityAlertsFired: Set<string> = new Set();

class BusTrackingService {
  private timerId: number | null = null;
  private pathStepIndex: number = 0;
  private currentBusId: string = 'BUS001';

  public init() {
    this.startSimulation();
  }

  public startSimulation() {
    if (this.timerId !== null) return;

    this.timerId = window.setInterval(() => {
      this.tick();
    }, 2000); // Ticks every 2s

    store.updateSimulation({ isRunning: true });
  }

  public stopSimulation() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    store.updateSimulation({ isRunning: false });
  }

  public setSpeedMultiplier(multiplier: number) {
    store.updateSimulation({ speedMultiplier: multiplier });
    // Restart timer with adjusted interval
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      const interval = Math.max(300, Math.round(2000 / multiplier));
      this.timerId = window.setInterval(() => {
        this.tick();
      }, interval);
    }
  }

  public resetTrip(busId: string = 'BUS001') {
    proximityAlertsFired.clear();
    this.pathStepIndex = 0;
    const state = store.getState();
    const route = state.routes.find((r) => r.routeId === 'RT001');

    if (route && route.pathCoordinates.length > 0) {
      const [startLat, startLng] = route.pathCoordinates[0];
      store.updateBus(busId, {
        currentLocation: {
          latitude: startLat,
          longitude: startLng,
          heading: 45,
          address: `${route.stops[0]?.name || 'Origin Terminal'}`,
        },
        currentSpeed: 35,
        status: 'approaching',
        delayMinutes: 0,
        currentETA: '08:30 AM',
        currentStopIndex: 0,
        distanceToNextStopMeters: 2500,
      });
    }

    store.updateSimulation({
      isRunning: true,
      simulatedDelayMinutes: 0,
      trafficSeverity: 'normal',
      tripActive: true,
    });
  }

  private tick() {
    const state = store.getState();
    if (!state.simulation.isRunning) return;

    const busId = state.simulation.activeBusId || 'BUS001';
    const bus = state.buses.find((b) => b.busId === busId);
    if (!bus) return;

    const route = state.routes.find((r) => r.routeId === bus.routeId);
    if (!route || !route.pathCoordinates || route.pathCoordinates.length === 0) return;

    // Advance along route path coordinates
    this.pathStepIndex = (this.pathStepIndex + 1) % route.pathCoordinates.length;
    const [currentLat, currentLng] = route.pathCoordinates[this.pathStepIndex];
    const nextIdx = (this.pathStepIndex + 1) % route.pathCoordinates.length;
    const [nextLat, nextLng] = route.pathCoordinates[nextIdx];

    // Compute heading
    const heading = Math.round(
      (Math.atan2(nextLng - currentLng, nextLat - currentLat) * 180) / Math.PI + 360
    ) % 360;

    // Find nearest stop ahead
    let nearestStop = route.stops[0];
    let minDistanceToStop = 999999;
    let stopIndex = 0;

    route.stops.forEach((stop, idx) => {
      const dist = calculateDistanceMeters(currentLat, currentLng, stop.latitude, stop.longitude);
      if (dist < minDistanceToStop) {
        minDistanceToStop = dist;
        nearestStop = stop;
        stopIndex = idx;
      }
    });

    // Speed calculation influenced by traffic condition
    let currentSpeed = 38;
    if (state.simulation.trafficSeverity === 'moderate') currentSpeed = 24;
    if (state.simulation.trafficSeverity === 'heavy') currentSpeed = 12;
    if (state.simulation.trafficSeverity === 'severe') currentSpeed = 4;
    if (bus.status === 'breakdown') currentSpeed = 0;

    // Update bus location in store
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    store.updateBus(busId, {
      currentLocation: {
        latitude: currentLat,
        longitude: currentLng,
        heading,
        address: minDistanceToStop < 200 ? `At ${nearestStop.name}` : `Heading towards ${nearestStop.name}`,
      },
      currentSpeed,
      currentStopIndex: stopIndex,
      distanceToNextStopMeters: minDistanceToStop,
      lastUpdated: nowTime,
    });

    // Check Smart Pickup Alert Engine for all students assigned to this bus
    this.checkSmartPickupAlerts(busId, currentLat, currentLng);

    // Evaluate delays periodically or when traffic simulated
    if (state.simulation.simulatedDelayMinutes > 0) {
      DelayDetectionService.evaluateBusDelay(busId, state.simulation.simulatedDelayMinutes);
    }
  }

  /**
   * SECTION 9: SMART PICKUP ALERT ENGINE
   * Checks distance to each student's pickup stop and generates idempotent alerts:
   * - <= 1000m: approaching
   * - <= 500m: 500m get ready
   * - <= 80m: reached stop
   */
  public checkSmartPickupAlerts(busId: string, busLat: number, busLng: number) {
    const state = store.getState();
    const bus = state.buses.find((b) => b.busId === busId);
    if (!bus) return;

    const assignedStudents = state.students.filter(
      (s) => s.busId === busId && s.boardingStatus === 'not_boarded'
    );
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    assignedStudents.forEach((student) => {
      // Find the student's pickup stop
      const route = state.routes.find((r) => r.routeId === student.routeId);
      const stop = route?.stops.find((st) => st.stopId === student.pickupStopId);
      if (!stop) return;

      const dist = calculateDistanceMeters(busLat, busLng, stop.latitude, stop.longitude);

      // Threshold 1: At the pickup stop (<= 80m)
      const reachedKey = `${student.studentId}_${stop.stopId}_reached`;
      if (dist <= 80 && !proximityAlertsFired.has(reachedKey)) {
        proximityAlertsFired.add(reachedKey);
        store.addNotification({
          notificationId: `NOTIF_ARR_${student.studentId}_${Date.now()}`,
          recipientRole: 'student',
          recipientId: student.studentId,
          busId,
          title: '✅ Bus Arrived at Your Stop',
          message: `Bus ${bus.busNumber} has reached ${stop.name}. Please proceed to board now.`,
          timestamp: nowTime,
          priority: 'urgent',
          category: 'proximity',
          readStatus: false,
          metadata: { stopName: stop.name },
        });
        return;
      }

      // Threshold 2: At or below 500m (between 80m and 500m)
      const fiveHundredKey = `${student.studentId}_${stop.stopId}_500m`;
      if (dist > 80 && dist <= 500 && !proximityAlertsFired.has(fiveHundredKey)) {
        proximityAlertsFired.add(fiveHundredKey);
        store.addNotification({
          notificationId: `NOTIF_500M_${student.studentId}_${Date.now()}`,
          recipientRole: 'student',
          recipientId: student.studentId,
          busId,
          title: '🔔 Bus is 500m Away',
          message: `Your college bus ${bus.busNumber} is only 500m away from ${stop.name}. Please get ready at the boarding point.`,
          timestamp: nowTime,
          priority: 'high',
          category: 'proximity',
          readStatus: false,
          metadata: { stopName: stop.name },
        });
        return;
      }

      // Threshold 3: At or below 1 km (between 500m and 1000m)
      const oneKmKey = `${student.studentId}_${stop.stopId}_1km`;
      if (dist > 500 && dist <= 1000 && !proximityAlertsFired.has(oneKmKey)) {
        proximityAlertsFired.add(oneKmKey);
        store.addNotification({
          notificationId: `NOTIF_1KM_${student.studentId}_${Date.now()}`,
          recipientRole: 'student',
          recipientId: student.studentId,
          busId,
          title: '🚌 Bus Approaching Pickup Stop',
          message: `Your bus ${bus.busNumber} is approaching ${stop.name} (~1 km away). Expected arrival in 3-4 mins.`,
          timestamp: nowTime,
          priority: 'normal',
          category: 'proximity',
          readStatus: false,
          metadata: { stopName: stop.name },
        });
        return;
      }
    });
  }
}

export const trackingService = new BusTrackingService();
