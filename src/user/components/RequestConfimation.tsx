import { useCalendar } from "../hooks/useCalendar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import useFetch from "@/hooks/useFetch";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
export default function RequestConfirmation() {
          const { toast } = useToast()
          const navigate = useNavigate()
          const { state } = useAuth()
          const { state: calendarState, dispatch: calendarDispatch } = useCalendar();
          const [isLoading, setIsLoading] = useState<boolean>(false);
          const handlePreviousStep = () => {
                    calendarDispatch({ type: 'PREV' });
                    setTimeout(() => {
                              calendarDispatch({ type: 'OFF_ANIMATING' });
                    }, 500);
          }
          const handleSubmitRequest = async () => {
                    setIsLoading(true)
                    try {
                              const response = await useFetch('/requests', {
                                        method: 'POST',
                                        body: {
                                                  requestor: state?.user?.id,
                                                  startDate: calendarState.requestData.scheduleDate[0],
                                                  endDate: calendarState.requestData.scheduleDate[1],
                                                  vehicle: calendarState.selectedVehicle?._id,
                                                  ...calendarState.requestData
                                        }
                              })
                              if (response) {
                                        console.log(response);

                              }

                              if (response.success) {
                                        calendarDispatch({ type: 'RESET' })
                                        toast({
                                                  title: 'Success!',
                                                  description: 'Your request has been submitted successfully. Please wait for a response from our team.',
                                        })
                                        navigate('/requests')
                              } else if (!response.success) {
                                        toast({
                                                  title: 'Ooops!',
                                                  description: response.message || 'Something went wrong'
                                        })
                              }
                    } catch (error) {
                              console.log(error);
                    } finally {
                              setIsLoading(false)
                    }
          };
          return (
                    <div className="container">

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
                              <div className="flex">
                                        <div className='lg:w-3/5 w-full'>
                                                  <figure>
                                                            <h3 className='text-xl font-semibold'>Vehicle</h3>

                                                            <div className='max-w-full flex justify-center overflow-x-auto gap-1'>
                                                                      {calendarState.selectedVehicle?.images.map((image, index) => (
                                                                                <img key={index} src={`${import.meta.env.VITE_UPLOAD_URL}/vehicles/${image}`} className='object-cover h-52 rounded' alt={calendarState.selectedVehicle?.model} />
                                                                      ))}
                                                            </div>
                                                            <figcaption>
                                                                      <div className='my-2 mx-5'>
                                                                                <p className='text-3xl font-semibold'>{calendarState.selectedVehicle?.model}  <sup className='text-base'>({calendarState.selectedVehicle?.year})</sup></p>
                                                                                <p className=''>{calendarState.selectedVehicle?.color}</p>
                                                                                <p className='ms-2'>{calendarState.selectedVehicle?.licensePlate}</p>
                                                                      </div>
                                                            </figcaption>
                                                  </figure>
                                        </div>
                                        <div className='lg:w-2/5 h-full flex flex-col justify-between items-center space-y-10 py-16'>
                                                  <Card className="size-full">
                                                            <CardHeader>
                                                                      <CardTitle>
                                                                                Step 3: Request confirmations
                                                                      </CardTitle>
                                                            </CardHeader>
                                                            <CardContent className="my-5">
                                                                      <ul className='ms-12'>
                                                                                <li>Review the requested dates and vehicles.</li>
                                                                                <li>Confirm your request and click <strong>Submit Request</strong>.</li>
                                                                      </ul>
                                                            </CardContent>
                                                            <CardFooter className="flex justify-end gap-1.5">
                                                                      <Button variant='outline' onClick={handlePreviousStep}>Back</Button>
                                                                      <Button isLoading={isLoading} onClick={handleSubmitRequest}>Submit Request</Button>
                                                            </CardFooter>
                                                  </Card>
                                        </div>
                              </div>
                    </div>
          )
}
