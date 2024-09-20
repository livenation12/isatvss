import React, { createContext, useReducer, ReactNode } from 'react';

// Define the shape of the state
interface CalendarState {
          step: number;
          selectedDates: [Date | null, Date | null];
          animating: boolean;
          direction: 'next' | 'previous';
}

// Define action types
type Action =
          | { type: 'SET_DATE'; payload: [Date | null, Date | null] }
          | { type: 'NEXT' }
          | { type: 'PREV' }
          | { type: 'SET_ANIMATING'; payload: boolean };

// Initial state
const initialState: CalendarState = {
          step: 1,
          selectedDates: [null, null],
          animating: false,
          direction: 'next',
};

// Reducer function
const calendarReducer = (state: CalendarState, action: Action): CalendarState => {
          switch (action.type) {
                    case 'SET_DATE':
                              return { ...state, selectedDates: action.payload };
                    case 'NEXT':
                              return { ...state, step: state.step + 1, animating: true, direction: 'next' };
                    case 'PREV':
                              return { ...state, step: state.step - 1, animating: true, direction: 'previous' };
                    case 'SET_ANIMATING':
                              return { ...state, animating: action.payload };
                    default:
                              return state;
          }
};

// Context
export interface CalendarContextProps {
          state: CalendarState;
          dispatch: React.Dispatch<Action>;
}

export const CalendarContext = createContext<CalendarContextProps | undefined>(undefined);

// Provider component
export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
          const [state, dispatch] = useReducer(calendarReducer, initialState);

          return (
                    <CalendarContext.Provider value={{ state, dispatch }}>
                              {children}
                    </CalendarContext.Provider>
          );
};
