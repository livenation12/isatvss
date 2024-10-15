import { CalendarContext, ICalendarContextProps } from "../contexts/CalendarContext";
import { useContext } from "react";
export const useCalendar = (): ICalendarContextProps => {
          const context = useContext(CalendarContext);
          if (context === undefined) {
                    throw new Error('useCalendar must be used within a CalendarProvider');
          }
          return context;
};