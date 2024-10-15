import { useCallback } from 'react'
import Calendar from 'react-calendar';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useCalendar } from '../hooks/useCalendar';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { DateRange } from '../features/CalendarRequest';
export default function CalendarDate() {
          const { toast } = useToast();
          const { state, dispatch } = useCalendar();

          const handleNextStep = () => {
                    if (!state.selectedDates[0] || !state.selectedDates[1]) {
                              toast({
                                        title: 'Ooops!',
                                        description: 'Please select a range of dates before proceeding.',
                              })
                              return;
                    }
                    dispatch({ type: 'NEXT' });
                    setTimeout(() => {
                              dispatch({ type: 'OFF_ANIMATING' });
                    }, 500);
          };
          const handleDateChange: any = useCallback(
                    (value: DateRange) => {
                              // Ensure value is an array (for range selection)
                              if (Array.isArray(value)) {
                                        dispatch({ type: 'SET_DATE', payload: value });
                              } else {
                                        // Handle the case where value is not an array (could be a single date or null)
                                        dispatch({ type: 'SET_DATE', payload: [null, null] });
                              }
                    },
                    [state.selectedDates]
          );
          return (
                    <>
                              <div className='space-y-2 mt-10'>
                                        <h1 className='text-5xl font-semibold'>Schedule your request via our calendar.</h1>
                                        <p className='text-3xl font-bold'>Step 1:     </p>
                                        <ul className='ms-12'>
                                                  <li>Determine range of days of the event and click (two if more than 1) the calendar's date you want.</li>
                                                  <li>After select click <strong>next</strong></li>
                                        </ul>
                              </div>
                              <div className=''>
                                        <div className="text-lg font-bold flex justify-between items-center">
                                                  <span>
                                                            Select dates
                                                  </span>

                                        </div>
                                        <Calendar
                                                  next2Label={null}
                                                  prev2Label={null}
                                                  nextLabel={<ArrowRight className='inline-flex justify-center ms-5' size={18} />}
                                                  prevLabel={<ArrowLeft className='inline-flex justify-center me-5' size={18} />}
                                                  className="w-full modern-calendar"
                                                  selectRange={true} // Enable range selection
                                                  onChange={handleDateChange} // Handle selected dates
                                                  value={state.selectedDates} // Current selected dates
                                                  tileContent={({ date, view }) => {
                                                            if (view === 'month' && state.selectedDates) {
                                                                      const [start, end] = state.selectedDates;

                                                                      if (date.toDateString() === start?.toDateString()) {
                                                                                return (
                                                                                          <div className='relative text-xs'>
                                                                                                    start
                                                                                          </div>
                                                                                )
                                                                      }
                                                                      if (date.toDateString() === end?.toDateString()) {
                                                                                return (
                                                                                          <div className='relative text-xs'>
                                                                                                    end
                                                                                          </div>
                                                                                )
                                                                      }
                                                            }
                                                            return null;
                                                  }}
                                        />
                                        <Button className="my-2 float-right" onClick={handleNextStep}>
                                                  Next <ArrowRight size={15} className='ms-2' />
                                        </Button>
                              </div>
                    </>
          )
}
