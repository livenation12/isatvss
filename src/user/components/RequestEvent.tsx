import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, CalendarIcon } from "lucide-react";
import { useCalendar } from "../hooks/useCalendar";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
          Popover,
          PopoverContent,
          PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import TimeEvents from "@/assets/chatting.png"
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { IEvent } from "@/interfaces";
import { spawn } from "child_process";
interface RequestEventForm extends IEvent {
          startTime: string
          endTime: string
}

export default function RequestEvent() {
          const { state, dispatch } = useCalendar();
          const [schedType, setSchedType] = useState(true) //true is multiday
          const { scheduleDate, ...restRequestData } = state.requestData
          const { register, handleSubmit, setError, setValue, formState: { errors } } = useForm<RequestEventForm>({
                    defaultValues: restRequestData
          })
          const [submitError, setSubmitError] = useState('')
          const today = new Date();

          const handleNextStep: SubmitHandler<RequestEventForm> = (data) => {
                    if (state.requestData.scheduleDate[0] && state.requestData.scheduleDate[1]) {
                              if (new Date(state.requestData.scheduleDate[0]) >= new Date(state.requestData.scheduleDate[1])) {
                                        setError('endTime', {
                                                  type: 'custom',
                                                  message: 'End date and time must be later than your start date and time',
                                        });
                                        return;
                              }
                              dispatch({ type: "SET_REQUEST", payload: data })
                              dispatch({ type: "NEXT" });
                    } else {
                              setSubmitError('Dates for your event is required')
                              return
                    }
          }

          const handleSelectDate = (selectedDate: Date | undefined) => {
                    if (!selectedDate) return
                    // Handle the valid date case here
                    if (schedType) {
                              return dispatch({ type: 'SET_DATE', payload: [selectedDate, state.requestData.scheduleDate[1]] });
                    }
                    return dispatch({ type: 'SET_DATE', payload: [selectedDate, selectedDate] })
          };

          const handleHourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                    const [hours, minutes] = event.target.value.split(':');

                    // Check if it's startTime or endTime and dispatch accordingly
                    if (event.target.id === 'startTime') {
                              dispatch({ type: 'SET_HOUR', payload: { startHour: hours, startMinute: minutes } });
                    } else if (event.target.id === 'endTime') {
                              dispatch({ type: 'SET_HOUR', payload: { endHour: hours, endMinute: minutes } });
                    }
          };

          const handleSelectEndDate = (selectedDate: Date | undefined) => {
                    if (!selectedDate) return
                    dispatch({ type: 'SET_DATE', payload: [state.requestData.scheduleDate[0] || today, selectedDate] });
          }

          const handleSwitch = () => {
                    setSchedType(!schedType)
                    //if switch turns to single day update the end time same as the start time and date
                    if (schedType) {
                              dispatch({ type: 'SET_DATE', payload: state.requestData.scheduleDate[0] ? [state.requestData.scheduleDate[0], state.requestData.scheduleDate[0]] : [undefined, undefined] });
                              const hoursOfTheStartDate = state.requestData.scheduleDate[0]?.getHours() || ''
                              //Stringify the hours
                              setValue('endTime', String(hoursOfTheStartDate))
                    }
          }

          return (
                    <div>
                              <div className="grid lg:grid-cols-5 gap-5 md:gap-10 lg:gap-20">
                                        <div className="lg:col-span-2 col-span-full">
                                                  <figure className="flex flex-col">
                                                            <figcaption>
                                                                      <h3 className="text-4xl font-semibold text-center">Time and Events</h3>
                                                            </figcaption>
                                                            <img src={TimeEvents} className="lg:w-full md:w-300 w-100" alt="" />
                                                  </figure>
                                        </div>
                                        <div className="lg:col-span-3 col-span-full">
                                                  <Card className="w-full">
                                                            <CardHeader>
                                                                      <CardTitle className="text-2xl font-semibold">Event details</CardTitle>
                                                                      <CardDescription>Describe your event you want to schedule</CardDescription>
                                                            </CardHeader>
                                                            <form onSubmit={handleSubmit(handleNextStep)}>
                                                                      <CardContent className="flex flex-col my-2 gap-2">
                                                                                <div>
                                                                                          <Label className="font-semibold">Name of event</Label>
                                                                                          <Input {...register("eventName", { required: "Event name is required." })} placeholder="Event name" />
                                                                                          {errors.eventName && <p className="text-xs ms-1 text-red-500">{errors.eventName.message}</p>}
                                                                                </div>
                                                                                <div>
                                                                                          <Label className="font-semibold">Location</Label>
                                                                                          <Input {...register("eventLocation", { required: "Location is required." })} placeholder="Location name" />
                                                                                          {errors.eventLocation && <p className="text-xs ms-1 text-red-500">{errors.eventLocation.message}</p>}
                                                                                </div>
                                                                                <div>
                                                                                          <Label className="font-semibold">Event description <span className="text-gray-500 font-normal text-xs">(optional)</span></Label>
                                                                                          <Textarea {...register("eventDescription")} placeholder="Describe event" />
                                                                                </div>

                                                                                <div className="flex flex-col space-x-1.5">
                                                                                          <div className="flex justify-between my-1.5">
                                                                                                    <Label className="font-semibold my-1.5" htmlFor="date">Date</Label>
                                                                                                    <div className="inline-flex items-center gap-1.5">
                                                                                                              <Switch id="switch" onClick={handleSwitch} /> <Label htmlFor="switch" className="text-sm">{schedType ? 'Multiple day' : 'Single day'}</Label>
                                                                                                    </div>

                                                                                          </div>
                                                                                          <div className="grid grid-cols-2 gap-1.5">
                                                                                                    <Popover>
                                                                                                              <PopoverTrigger asChild>
                                                                                                                        <Button
                                                                                                                                  variant={"outline"}
                                                                                                                                  className={cn(
                                                                                                                                            "w-[240px] justify-start text-left font-normal",
                                                                                                                                            !state.requestData.scheduleDate[0] && "text-muted-foreground"
                                                                                                                                  )}
                                                                                                                        >
                                                                                                                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                                                                                                                  {state.requestData.scheduleDate[0] ? format(state.requestData.scheduleDate[0], "PPP") : <span>Pick a start date</span>}
                                                                                                                        </Button>
                                                                                                              </PopoverTrigger>
                                                                                                              <PopoverContent className="w-auto p-0" align="start">
                                                                                                                        <Calendar
                                                                                                                                  mode="single"
                                                                                                                                  selected={state.requestData.scheduleDate[0] || undefined}
                                                                                                                                  onSelect={handleSelectDate}
                                                                                                                                  initialFocus
                                                                                                                        />
                                                                                                              </PopoverContent>
                                                                                                    </Popover>
                                                                                                    {schedType ? <Popover>
                                                                                                              <PopoverTrigger asChild>
                                                                                                                        <Button
                                                                                                                                  disabled={!schedType}
                                                                                                                                  variant={"outline"}
                                                                                                                                  className={cn(
                                                                                                                                            "w-[240px] justify-start text-left font-normal",
                                                                                                                                            !state.requestData.scheduleDate[0] && "text-muted-foreground"
                                                                                                                                  )}
                                                                                                                        >
                                                                                                                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                                                                                                                  {!schedType ? state.requestData.scheduleDate[0] ? format(state.requestData.scheduleDate[0], "PPP") : <span>Pick start date</span> :
                                                                                                                                            state.requestData.scheduleDate[1] ? format(state.requestData.scheduleDate[1], "PPP") : <span>Pick end date</span>}
                                                                                                                        </Button>
                                                                                                              </PopoverTrigger>
                                                                                                              <PopoverContent className="w-auto p-0" align="start">
                                                                                                                        <Calendar
                                                                                                                                  disabled={!schedType}
                                                                                                                                  mode="single"
                                                                                                                                  selected={state.requestData.scheduleDate[1] || undefined}
                                                                                                                                  onSelect={handleSelectEndDate}
                                                                                                                                  initialFocus
                                                                                                                        />
                                                                                                              </PopoverContent>
                                                                                                    </Popover>
                                                                                                              : <div></div>}
                                                                                                    <div>
                                                                                                              <Label className="font-semibold" htmlFor="startTime">Start time</Label>
                                                                                                              <Input {...register("startTime", { required: "Start time is required." })} id="startTime" onChange={handleHourChange} type="time" />
                                                                                                              {errors.startTime && <p className="text-xs ms-1 text-red-500">{errors.startTime.message}</p>}
                                                                                                    </div>
                                                                                                    <div className="relative">
                                                                                                              <Label className="font-semibold" htmlFor="endTime">End Time</Label>
                                                                                                              <Input {...register("endTime", { required: "End time is required." })} id="endTime" type="time" onChange={handleHourChange} />

                                                                                                              <p className="absolute text-xs ms-1 text-red-500 top-full left-0">
                                                                                                                        {errors?.endTime?.message}
                                                                                                              </p>
                                                                                                    </div>
                                                                                          </div>
                                                                                </div>
                                                                      </CardContent>
                                                                      {submitError ? <p className="text-xs mx-10 text-red-500">{submitError}</p> : null}
                                                                      <CardFooter className="flex justify-end gap-2">
                                                                                <Button type="submit">Next<ArrowRight className="ms-1" size={16} /></Button>
                                                                      </CardFooter>
                                                            </form>
                                                  </Card>
                                        </div>
                              </div>
                    </div>
          )
}
