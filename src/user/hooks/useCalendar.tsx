import { CalendarContextProps } from "../contexts/CalendarContext";
import { CalendarContext } from "../contexts/CalendarContext";
import { useContext } from "react";
export const useCalendar = (): CalendarContextProps => {
          const context = useContext(CalendarContext);
          if (context === undefined) {
                    throw new Error('useCalendar must be used within a CalendarProvider');
          }
          return context;
};