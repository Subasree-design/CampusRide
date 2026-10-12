import { store } from './store';
import { DelayAlert, NotificationItem, Bus } from '../types';

export interface DelayEvaluationResult {
  isDelayed: boolean;
  delayMinutes: number;
  priority: 'moderate' | 'high' | 'critical';
  alertCreated: boolean;
  alert?: DelayAlert;
}

// Track last alerted delay amount per bus to prevent notification flooding
const lastAlertedDelay: Record<string, number> = {};

export class DelayDetectionService {
  /**
   * Evaluates delay for a bus, triggers departmental HOD notifications and admin escalation
   */
  public static evaluateBusDelay(
    busId: string,
    forcedDelayMinutes?: number,
    customReason?: string
  ): DelayEvaluationResult {
    const state = store.getState();
    const bus = state.buses.find((b) => b.busId === busId);
    if (!bus) {
      return { isDelayed: false, delayMinutes: 0, priority: 'moderate', alertCreated: false };
    }

    const route = state.routes.find((r) => r.routeId === bus.routeId);
    const delayMinutes = forcedDelayMinutes !== undefined ? forcedDelayMinutes : bus.delayMinutes;

    const delayThreshold = 10; // Admin configurable: 10 min
    const escalationThreshold = 20; // 20 min triggers transport admin escalation

    if (delayMinutes < delayThreshold) {
      // If delay cleared, update bus status back to on_time / approaching
      if (bus.status === 'delayed') {
        store.updateBus(busId, {
          status: 'on_time',
          delayMinutes: 0,
          currentETA: bus.expectedETA,
        });
      }
      delete lastAlertedDelay[busId];
      return { isDelayed: false, delayMinutes: 0, priority: 'moderate', alertCreated: false };
    }

    // Determine priority
    const priority: 'moderate' | 'high' | 'critical' =
      delayMinutes >= escalationThreshold ? 'high' : 'moderate';

    // Check if we already alerted for this delay bracket (+/- 3 minutes difference)
    const prevAlerted = lastAlertedDelay[busId];
    if (prevAlerted !== undefined && Math.abs(prevAlerted - delayMinutes) < 3) {
      // Already alerted for this level of delay
      return { isDelayed: true, delayMinutes, priority, alertCreated: false };
    }

    // Mark as alerted
    lastAlertedDelay[busId] = delayMinutes;

    // Calculate updated ETA string
    const currentETA = this.calculateNewETA(bus.expectedETA, delayMinutes);
    const reason = customReason || (delayMinutes >= 20 ? 'Severe GST Road Traffic & Congestion' : 'Heavy Traffic Delay');

    // Update bus state
    store.updateBus(busId, {
      status: 'delayed',
      delayMinutes,
      currentETA,
    });

    // Execute Department-Wise HOD Alert Engine
    const alert = this.notifyAffectedHODs(busId, {
      delayMinutes,
      currentETA,
      reason,
      priority,
      routeName: route?.routeName || 'Campus Transit Route',
    });

    return {
      isDelayed: true,
      delayMinutes,
      priority,
      alertCreated: true,
      alert,
    };
  }

  /**
   * CRITICAL REQUIREMENT:
   * Dynamic group of affected students by department,
   * mapped to department HODs with department-specific affected student counts!
   */
  public static notifyAffectedHODs(
    busId: string,
    eventData: {
      delayMinutes: number;
      currentETA: string;
      reason: string;
      priority: 'moderate' | 'high' | 'critical';
      routeName: string;
    }
  ): DelayAlert {
    const state = store.getState();
    const bus = state.buses.find((b) => b.busId === busId);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const busNumber = bus?.busNumber || 'KCG Bus';

    // 1. Identify all students assigned to this bus
    const assignedStudents = state.students.filter((s) => s.busId === busId);
    const affectedStudentIds = assignedStudents.map((s) => s.studentId);

    // 2. Group affected students by department ('CSE', 'ECE', 'IT')
    const departmentCounts: Record<string, number> = {};
    assignedStudents.forEach((student) => {
      departmentCounts[student.department] = (departmentCounts[student.department] || 0) + 1;
    });

    const affectedDepartmentsList: DelayAlert['affectedDepartments'] = [];
    const isEscalatedToAdmin = eventData.delayMinutes >= 20;

    // 3. For each department with assigned students on this bus, notify its HOD
    Object.entries(departmentCounts).forEach(([deptCode, count]) => {
      const hod = state.hods.find((h) => h.department === deptCode);
      if (!hod) return;

      affectedDepartmentsList.push({
        department: deptCode as 'CSE' | 'ECE' | 'IT',
        studentCount: count,
        hodId: hod.hodId,
        hodNotified: true,
        notificationTimestamp: nowTime,
      });

      // Construct department-specific notification message:
      // e.g. "🚨 Bus KCG-07 on the Tambaram–KCG route is delayed by 15 minutes. 18 CSE students are affected. Current ETA: 08:45 AM."
      const hodNotification: NotificationItem = {
        notificationId: `NOTIF_HOD_${hod.hodId}_${busId}_${Date.now()}`,
        recipientRole: 'hod',
        recipientId: hod.hodId,
        busId,
        title: `🚨 Bus Delay Alert: ${busNumber} (${deptCode})`,
        message: `Bus ${busNumber} on ${eventData.routeName} is delayed by ${eventData.delayMinutes} mins. ${count} ${deptCode} students are affected. Current ETA: ${eventData.currentETA}. Reason: ${eventData.reason}.`,
        timestamp: nowTime,
        priority: eventData.priority === 'high' ? 'high' : 'normal',
        category: 'delay',
        readStatus: false,
        metadata: {
          delayMinutes: eventData.delayMinutes,
          affectedStudentCount: count,
          department: deptCode,
          currentETA: eventData.currentETA,
        },
      };

      store.addNotification(hodNotification);
    });

    // 4. Notify Transport Admin if delay >= 20 minutes (Escalation Rule)
    if (isEscalatedToAdmin) {
      const totalAffected = assignedStudents.length;
      const breakdownText = Object.entries(departmentCounts)
        .map(([dept, c]) => `${c} ${dept}`)
        .join(', ');

      const adminNotification: NotificationItem = {
        notificationId: `NOTIF_ADMIN_DELAY_${busId}_${Date.now()}`,
        recipientRole: 'admin',
        busId,
        title: `⚠️ CRITICAL DELAY ESCALATION: ${busNumber}`,
        message: `Bus ${busNumber} has exceeded 20 min threshold (Delay: ${eventData.delayMinutes} mins). ${totalAffected} students affected (${breakdownText}). Current ETA: ${eventData.currentETA}. Immediate routing oversight recommended.`,
        timestamp: nowTime,
        priority: 'urgent',
        category: 'delay',
        readStatus: false,
        metadata: {
          delayMinutes: eventData.delayMinutes,
          affectedStudentCount: totalAffected,
          currentETA: eventData.currentETA,
        },
      };

      store.addNotification(adminNotification);
    }

    // 5. Notify assigned students on this bus
    const studentNotification: NotificationItem = {
      notificationId: `NOTIF_STU_DELAY_${busId}_${Date.now()}`,
      recipientRole: 'student',
      busId,
      title: `Bus ${busNumber} Delayed by ${eventData.delayMinutes} mins`,
      message: `Your college bus ${busNumber} is experiencing delays due to ${eventData.reason}. New expected arrival at campus is ${eventData.currentETA}.`,
      timestamp: nowTime,
      priority: 'normal',
      category: 'delay',
      readStatus: false,
      metadata: {
        delayMinutes: eventData.delayMinutes,
        currentETA: eventData.currentETA,
      },
    };
    store.addNotification(studentNotification);

    // 6. Record master DelayAlert in store for auditing and delay monitoring table
    const delayAlert: DelayAlert = {
      alertId: `ALERT_DLY_${Date.now()}`,
      busId,
      busNumber,
      routeId: bus?.routeId || '',
      routeName: eventData.routeName,
      expectedETA: bus?.expectedETA || '08:30 AM',
      currentETA: eventData.currentETA,
      delayMinutes: eventData.delayMinutes,
      affectedStudentIds,
      affectedDepartments: affectedDepartmentsList,
      adminNotified: isEscalatedToAdmin,
      reason: eventData.reason,
      priority: eventData.priority,
      timestamp: nowTime,
      status: 'active',
    };

    store.addDelayAlert(delayAlert);
    return delayAlert;
  }

  /**
   * Helper to add minutes to time strings like "08:30 AM"
   */
  public static calculateNewETA(baseTime: string, addedMinutes: number): string {
    try {
      const match = baseTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return baseTime;

      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const modifier = match[3].toUpperCase();

      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;

      const totalMinutes = hours * 60 + minutes + addedMinutes;
      const newHours24 = Math.floor(totalMinutes / 60) % 24;
      const newMinutes = totalMinutes % 60;

      const newModifier = newHours24 >= 12 ? 'PM' : 'AM';
      let displayHours = newHours24 % 12;
      if (displayHours === 0) displayHours = 12;

      return `${String(displayHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')} ${newModifier}`;
    } catch {
      return baseTime;
    }
  }
}
