import { ArrowLeft, ArrowRight } from 'lucide-react';
import Calendar, { CalendarProps } from 'react-calendar';
import { useCalendar } from '../hooks/useCalendar';
import { Button } from '@/components/ui/button';

const CalendarStepOne: React.FC = () => {
          const { state, dispatch } = useCalendar();

          const handleDateChange: CalendarProps['onChange'] = (
                    value
          ) => {
                    // Check if 'value' is a range and both dates are valid
                    if (Array.isArray(value) && value.every(date => date instanceof Date)) {
                              dispatch({ type: 'SET_DATE', payload: value });
                    }
          };

          const handleNextStep = (): void => {
                    if (!state.selectedDates[0] || !state.selectedDates[1]) {
                              alert('Please select a range of dates before proceeding.');
                              return;
                    }
                    dispatch({ type: 'NEXT' });
          };

          return (
                    <>
                              <div className='w-3/5 space-y-2 mt-10 animate-fadeInLeft'>
                                        <h1 className='text-5xl font-semibold'>Schedule your request via our calendar.</h1>
                                        <p className='text-3xl font-bold'>Step 1:</p>
                                        <ul className='ms-12'>
                                                  <li>Determine range of days of the event and click (two if more than 1) the calendar's date you want.</li>
                                                  <li>After select, click <strong>next.</strong></li>
                                        </ul>
                              </div>
                              <div className='animate-fadeIn'>
                                        <p className="text-lg font-bold">Select dates</p>
                                        <Calendar
                                                  next2Label={null}
                                                  prev2Label={null}
                                                  nextLabel={<ArrowRight className='inline-flex justify-center' size={15} />}
                                                  prevLabel={<ArrowLeft className='inline-flex justify-center' size={15} />}
                                                  className="w-full modern-calendar"
                                                  selectRange={true}
                                                  onChange={handleDateChange}
                                                  value={state.selectedDates}
                                        />
                                        <Button className="my-2 float-right" onClick={handleNextStep}>
                                                  Next <ArrowRight size={15} className='ms-2' />
                                        </Button>
                              </div>
                    </>
          );
};

export default CalendarStepOne;
