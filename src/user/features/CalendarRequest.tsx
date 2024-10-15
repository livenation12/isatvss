import React from 'react';
import CalendarDate from '../components/CalendarDate';
import { useCalendar } from '../hooks/useCalendar';
import VehicleSelect from '../components/VehicleSelect';
import RequestConfirmation from '../components/RequestConfimation';
import RequestEvent from '../components/RequestEvent';

const CalendarForm: React.FC = () => {
  const { state: calendarState } = useCalendar();
  const renderStepContent = () => {

    switch (calendarState.step) {
      case 1:
        return (
          <CalendarDate />
        );
      case 2:
        return (
          <RequestEvent />
        );
      case 3:
        return (
          <VehicleSelect />
        );
      case 4:
        return (
          <RequestConfirmation />
        )
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 flex justify-center">
      {renderStepContent()}
    </div>
  );
};

export default CalendarForm;
