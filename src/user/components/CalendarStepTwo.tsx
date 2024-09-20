import { Button } from '@/components/ui/button';
import { useCalendar } from '../hooks/useCalendar';

const CalendarStepTwo: React.FC = () => {
          const { state, dispatch } = useCalendar();

          const handlePreviousStep = (): void => {
                    dispatch({ type: 'PREV' });
          };

          return (
                    <>
                              <h2 className="text-xl font-bold mb-4">Selected Dates</h2>
                              <ul className="mb-4">
                                        {state.selectedDates[0] && state.selectedDates[1] ? (
                                                  <>
                                                            <li>{state.selectedDates[0].toDateString()}</li>
                                                            <li>{state.selectedDates[1].toDateString()}</li>
                                                  </>
                                        ) : (
                                                  <p>No dates selected.</p>
                                        )}
                              </ul>
                              <Button className="mr-4" onClick={handlePreviousStep}>
                                        Back
                              </Button>
                              <Button onClick={() => alert('Dates confirmed!')}>Confirm</Button>
                    </>
          );
};

export default CalendarStepTwo;
