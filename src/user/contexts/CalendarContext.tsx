import React, { createContext, useReducer, ReactNode } from 'react';
import { IEvent, Vehicle } from '@/interfaces';

export interface IRequest extends IEvent {
          scheduleDate: [Date | undefined, Date | undefined]
          selectedVehicle: Vehicle | null
}

// Define the shape of the state
interface ICalendar {
          step: number;
          requestData: IRequest;
          animating: boolean;
          direction: 'next' | 'previous';
          selectedVehicle: Vehicle | null;
}

// Define action types
type Action =
          | { type: 'SET_DATE'; payload: [Date | undefined, Date | undefined] }
          | { type: 'SET_HOUR'; payload: { startHour?: string, startMinute?: string, endHour?: string, endMinute?: string } }
          | { type: 'NEXT' }
          | { type: 'PREV' }
          | { type: 'RESET' }
          | { type: 'OFF_ANIMATING' }
          | { type: 'SET_VEHICLE'; payload: Vehicle | null }
          | { type: 'SET_REQUEST'; payload: Partial<IRequest> }

// Initial state
const initialState: ICalendar = {
          step: 2,
          requestData: {
                    scheduleDate: [undefined, undefined],
                    selectedVehicle: null,
                    eventName: '',
                    eventLocation: '',
                    eventDescription: ''
          },
          animating: false,
          direction: 'next',
          selectedVehicle: null
};

// Reducer function
const calendarReducer = (state: ICalendar, action: Action): ICalendar => {
          switch (action.type) {
                    case 'SET_DATE':
                              return { ...state, requestData: { ...state.requestData, scheduleDate: action.payload } };

                    case 'SET_HOUR': {
                              const [startDate, endDate] = state.requestData.scheduleDate;

                              // Handle start time
                              const newStartDate = startDate ? new Date(startDate) : undefined;
                              if (newStartDate && action.payload.startHour && action.payload.startMinute) {
                                        newStartDate.setHours(parseInt(action.payload.startHour, 10));    // Set the start hour
                                        newStartDate.setMinutes(parseInt(action.payload.startMinute, 10)); // Set the start minute
                              }

                              // Handle end time
                              const newEndDate = endDate ? new Date(endDate) : undefined;
                              if (newEndDate && action.payload.endHour && action.payload.endMinute) {
                                        newEndDate.setHours(parseInt(action.payload.endHour, 10));    // Set the end hour
                                        newEndDate.setMinutes(parseInt(action.payload.endMinute, 10)); // Set the end minute
                              }

                              return {
                                        ...state,
                                        requestData: {
                                                  ...state.requestData,
                                                  scheduleDate: [newStartDate, newEndDate],
                                        }
                              }
                    }
                    case 'NEXT':
                              return { ...state, step: state.step + 1, animating: true, direction: 'next' };

                    case 'PREV':
                              return { ...state, step: state.step - 1, animating: true, direction: 'previous' };

                    case 'RESET':
                              return { ...state, step: 1, requestData: { ...state.requestData, eventName: '', eventLocation: '', eventDescription: '', scheduleDate: [undefined, undefined] }, animating: false, selectedVehicle: null };

                    case 'OFF_ANIMATING':
                              return { ...state, animating: false };

                    case 'SET_VEHICLE':
                              return { ...state, selectedVehicle: action.payload };
                    case 'SET_REQUEST':
                              return { ...state, requestData: { ...state.requestData, ...action.payload } };
                    default:
                              return state;
          }
};

// Context
export interface ICalendarContextProps {
          state: ICalendar;
          dispatch: React.Dispatch<Action>;
}

export const CalendarContext = createContext<ICalendarContextProps | undefined>(undefined);

// Provider component
export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
          const [state, dispatch] = useReducer(calendarReducer, initialState);
          return (
                    <CalendarContext.Provider value={{ state, dispatch }}>
                              {children}
                    </CalendarContext.Provider>
          );
};
