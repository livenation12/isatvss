import useFetch from '@/hooks/useFetch';
import { Requests } from '@/interfaces';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { useRequest } from '../hooks/useRequest';
import { Bell, CheckCircle } from 'lucide-react';
import ScheduleDetaillsDialog from './ScheduleDetaillsDialog';


export default function ScheduleCalendar() {
          const [requests, setRequests] = useState<Requests[]>([]);
          const [open, setIsOpen] = useState(false);
          const [dateEvent, setDateEvent] = useState<Date>();
          const { state } = useRequest();
          useEffect(() => {
                    const fetchRequests = async () => {
                              const response = await useFetch('/requests/status', {
                                        method: 'POST',
                                        body: { status: ['Completed', 'Approved'] },
                              });
                              if (response.success) {
                                        setRequests(response.data);
                              }
                    };
                    fetchRequests();
          }, [state.isUpdated]);

          const tileContents = ({ date, view }: any) => {
                    if (view === 'month') {
                              const renderedStatuses = new Set(); // Set to track rendered statuses
                              const icons = requests.map(request => {
                                        const startDate = new Date(request.startDate);
                                        const endDate = new Date(request.endDate);

                                        // Check if the current date is within the event's date range
                                        if (date >= startDate && date <= endDate) {
                                                  let symbolIcon = null;

                                                  // Determine the icon based on request status
                                                  if (request.status === 'Approved') {
                                                            symbolIcon = (
                                                                      <Bell size={15} className={`text-blue-500 absolute -top-9 -left-3`} />
                                                            );
                                                  } else if (request.status === 'Completed') {
                                                            symbolIcon = (
                                                                      <CheckCircle size={15} className={`text-green-500 absolute -top-9 -left-3`} />
                                                            );
                                                  }

                                                  // Check if this status has already been rendered for the date
                                                  if (symbolIcon && !renderedStatuses.has(request.status)) {
                                                            renderedStatuses.add(request.status); // Mark this status as rendered
                                                            return (
                                                                      <div key={request._id} className='w-full h-full relative'>
                                                                                {symbolIcon}
                                                                      </div>
                                                            );
                                                  }
                                        }
                                        return null; // Return null if no event matches the current date
                              });

                              // Return the icons for the current date, filtering out null values
                              return icons.filter(icon => icon !== null);
                    }

                    return null; // Return null if not in 'month' view
          };



          const handleClickDay = (day: Date) => {
                    setIsOpen(true);
                    setDateEvent(day);
          }

          return (
                    <>
                              <ScheduleDetaillsDialog open={open} setIsOpen={setIsOpen} dateEvent={dateEvent} />
                              <Calendar
                                        onClickDay={handleClickDay}
                                        className='modern-calendar'
                                        value={new Date()}
                                        tileContent={tileContents} // Attach the tileContents function here
                              />
                    </>
          );
}
