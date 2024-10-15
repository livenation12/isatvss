import { useCalendar } from "../hooks/useCalendar";
import { useEffect, useState } from "react";
import { ArrowLeft, CircleAlert } from 'lucide-react';
import CarSelect from '@/assets/notfound.png';
import useFetch from "@/hooks/useFetch";
import { Vehicle } from "@/interfaces";
import { Schedule } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { IRequest } from "../contexts/CalendarContext";

export default function VehicleSelect() {
          const { state: calendarState, dispatch: calendarDispatch } = useCalendar();
          const [vehicles, setVehicles] = useState<Vehicle[]>([]);
          const [isVehicleAvailable, setIsVehicleAvailable] = useState<boolean>(true);

          const handleNextStep = () => {
                    calendarDispatch({ type: 'NEXT' });
                    setTimeout(() => {
                              calendarDispatch({ type: 'OFF_ANIMATING' });
                    }, 500);
          }
          const handlePreviousStep = () => {
                    calendarDispatch({ type: 'PREV' });
                    setTimeout(() => {
                              calendarDispatch({ type: 'OFF_ANIMATING' });
                    }, 500);
          }
          useEffect(() => {
                    const fetchVehicles = async () => {
                              const response = await useFetch('/vehicles', {});
                              setVehicles(response.data);
                    };
                    fetchVehicles();
          }, []);

          const hasVehicleScheduleConflict = (schedules: Schedule[], eventSchedule: IRequest['scheduleDate']): boolean => {
                    // Iterate over each schedule and check if there's an overlap
                    if (!eventSchedule) {
                              return true
                    }
                    const [eventStartDate, eventEndDate] = eventSchedule
                    if (!eventStartDate || !eventEndDate) return true
                    return schedules.some(schedule => {
                              const startDate = new Date(schedule.startDate);
                              const endDate = new Date(schedule.endDate);
                              // Check if the selected range overlaps with any schedule range
                              return (
                                        (eventStartDate <= endDate && eventEndDate >= startDate) // Conflict occurs if ranges overlap
                              );
                    });
          };

          const handleSelectedVehicle = (vehicle: Vehicle) => {
                    if (hasVehicleScheduleConflict(vehicle.schedules, calendarState.requestData.scheduleDate)) {
                              setIsVehicleAvailable(false);
                    } else {
                              setIsVehicleAvailable(true);
                              calendarDispatch({ type: 'SET_VEHICLE', payload: vehicle });
                    }
          }
          return (
                    <div className="container">
                              <div className='flex justify-between mb-2'>
                                        <div>
                                                  <h2 className='text-4xl font-bold'><span className='text-3xl font-semibold '>Choose your vehicle</span></h2>
                                                  <p className='ms-5 mt-2'>Choose the appropriate available vehicle for the campus on the left</p>
                                                  <p className='ms-5'>See the vehicle details on the right, then <strong>submit</strong></p>
                                        </div>
                                        <div>
                                                  <div className='bg-yellow-500 p-3 text-sm rounded-lg'>
                                                            <h4 className='font-semibold'>Your event date</h4>
                                                            <p>
                                                                      {calendarState.requestData.scheduleDate[0]
                                                                                ? format(calendarState.requestData.scheduleDate[0], "PPP p") // Date and time in AM/PM
                                                                                : 'No date selected'}
                                                                      <span className="font-semibold"> TO </span>
                                                                      {calendarState.requestData.scheduleDate[1]
                                                                                ? format(calendarState.requestData.scheduleDate[1], "PPP p") // Date and time in AM/PM
                                                                                : 'No date selected'}
                                                            </p>
                                                  </div>
                                        </div>
                              </div>
                              <div className='grid lg:grid-cols-3 gap-4'>
                                        <div>
                                                  <p className='px-5 py-2 pb-1'>{vehicles.length} Vehicles</p>
                                                  <ul className='space-y-4 flex lg:flex-col'>
                                                            {vehicles.map((vehicle) => {
                                                                      if (calendarState.requestData.scheduleDate[0] && calendarState.requestData.scheduleDate[1]) {
                                                                                const hasConflict = hasVehicleScheduleConflict(vehicle.schedules, calendarState.requestData.scheduleDate); // Check if vehicle has a conflict
                                                                                return (
                                                                                          <li
                                                                                                    key={vehicle._id}
                                                                                                    className={`rounded-lg border shadow-lg relative group ${hasConflict ? 'border-2 border-red-500' : ''}`}
                                                                                                    onClick={() => handleSelectedVehicle(vehicle)}
                                                                                          >
                                                                                                    {hasConflict && <span className='absolute rounded-s-lg right-0 top-5 bg-red-500 text-white text-xs px-3 py-2'>Unavailable</span>}
                                                                                                    <p className={`absolute hidden group-hover:block bg-white rounded-full py-1 px-2 text-xs text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg cursor-pointer`}>
                                                                                                              {hasConflict ? 'Schedule Conflict' : 'Click to see full details'}
                                                                                                    </p>
                                                                                                    <img
                                                                                                              src={`${import.meta.env.VITE_UPLOAD_URL}/vehicles/${vehicle.images[0]}`}
                                                                                                              className='rounded object-cover w-full min-h-max h-[250px]'
                                                                                                              alt={vehicle.model}
                                                                                                    />
                                                                                          </li>
                                                                                );
                                                                      }

                                                            })}
                                                  </ul>
                                        </div>
                                        <div className='col-span-2'>
                                                  <div className='p-5 rounded-xl border w-full border-gray-300 sticky bg-white top-20 shadow-xl'>
                                                            <div className='flex justify-end mb-1'>

                                                                      {
                                                                                calendarState.selectedVehicle &&
                                                                                <Button size='sm' variant='outline' onClick={() => calendarDispatch({ type: 'SET_VEHICLE', payload: null })}>Unselect</Button>
                                                                      }
                                                            </div>
                                                            {calendarState.selectedVehicle ? (
                                                                      <>
                                                                                <div className='max-w-full flex justify-center overflow-x-auto gap-1'>
                                                                                          {calendarState.selectedVehicle.images.map((image, index) => (
                                                                                                    <img key={index} src={`${import.meta.env.VITE_UPLOAD_URL}/vehicles/${image}`} className='object-cover h-52 rounded' alt={calendarState.selectedVehicle?.model} />
                                                                                          ))}
                                                                                </div>
                                                                                <div className='m-14'>
                                                                                          <p className='text-3xl font-semibold'>{calendarState.selectedVehicle.model}  <sup className='text-base'>({calendarState.selectedVehicle.year})</sup></p>
                                                                                          <p className='ms-2'>{calendarState.selectedVehicle.color}</p>
                                                                                          <p className='ms-2'>{calendarState.selectedVehicle.licensePlate}</p>
                                                                                          {!isVehicleAvailable && <p className='float-end text-sm text-red-500'><CircleAlert size={18} className='inline' /> This vehicle is unavailable on your selected date</p>}
                                                                                </div>
                                                                                <div className='absolute bottom-3 right-3'>
                                                                                          <Button variant={'outline'} className="mr-2" onClick={handlePreviousStep}>Back to calendar</Button>
                                                                                          {isVehicleAvailable ?
                                                                                                    <Button onClick={handleNextStep}>Next</Button>
                                                                                                    :
                                                                                                    <Button variant='destructive' disabled>Unavailable</Button>
                                                                                          }
                                                                                </div>
                                                                      </>
                                                            )
                                                                      :
                                                                      <>
                                                                                <Button variant={'ghost'} className="float-right underline" onClick={handlePreviousStep}>Back to calendar</Button>
                                                                                <h2 className='text-3xl font-semibold inline-flex items-center gap-x-3'><ArrowLeft /> Select a vehicle</h2>
                                                                                <p className='ms-10 text-xl'>See full details here</p>
                                                                                <div className='flex justify-center'>
                                                                                          <img className='object-cover self-center mt-10' width={500} src={CarSelect} alt='Car Select' />
                                                                                </div>
                                                                      </>
                                                            }
                                                  </div>
                                        </div>
                              </div>
                    </div>
          )
}
