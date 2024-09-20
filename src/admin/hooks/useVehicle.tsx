import { useContext } from 'react';
import { VehicleContext, VehicleContextType } from '../contexts/VehicleContext';


export const useVehicle = (): VehicleContextType => {
          const context = useContext(VehicleContext);
          if (!context) {
                    throw new Error('useVehicle must be used within an VehicleProvider');
          }
          return context;
};
