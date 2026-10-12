import React from 'react';
import { AppState } from '../../services/store';
import { LiveBusMap } from '../../components/map/LiveBusMap';
import { SimulationBadge } from '../../components/common/SimulationBadge';

interface DriverLiveRouteProps {
  state: AppState;
}

export const DriverLiveRoute: React.FC<DriverLiveRouteProps> = ({ state }) => {
  const bus = state.buses.find((b) => b.busId === 'BUS001') || state.buses[0];
  const route = state.routes.find((r) => r.routeId === bus.routeId) || state.routes[0];

  return (
    <div className="space-y-4 pb-20 md:pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Driver Navigation Route
          </h2>
          <p className="text-xs text-slate-500">
            {bus.busNumber} • {route.routeName}
          </p>
        </div>
        <SimulationBadge />
      </div>

      <LiveBusMap
        bus={bus}
        route={route}
        heightClass="h-[460px] sm:h-[540px]"
      />
    </div>
  );
};
