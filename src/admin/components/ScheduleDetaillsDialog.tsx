import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDate } from '@/helper'
import useFetch from '@/hooks/useFetch'
import { Requests } from '@/interfaces'
import { CalendarCheck, Car, LoaderCircle, MapPin, User } from 'lucide-react'
import { useEffect, useState } from 'react'
interface IScheduleDetaillsDialog {
          open: boolean
          setIsOpen: (open: boolean) => void
          dateEvent: Date | undefined
}

export default function ScheduleDetaillsDialog({ open, setIsOpen, dateEvent }: IScheduleDetaillsDialog) {
          const [isFetching, setIsFetching] = useState(false)
          const [requests, setRequests] = useState<Requests[]>([])
          useEffect(() => {
                    if (open && dateEvent) {
                              const fetchRequestDetails = async () => {
                                        setIsFetching(true)
                                        try {
                                                  const request = await useFetch(`/requests/date/${dateEvent.toISOString()}`, {})
                                                  if (request.success) {
                                                            console.log(request.data);

                                                            setRequests(request.data)
                                                  }
                                        } catch (error) {
                                                  console.log(error);

                                        } finally {
                                                  setIsFetching(false)
                                        }
                              }
                              fetchRequestDetails()
                    }
          }, [open, dateEvent])
          return (
                    <Dialog open={open} onOpenChange={setIsOpen}>
                              <DialogContent>
                                        <DialogHeader>
                                                  <DialogTitle>Schedule Details</DialogTitle>
                                                  <DialogDescription className='flex justify-end text-xs'>
                                                            {requests.length > 0 && requests.length + ' event' + (requests.length > 1 ? 's' : '')}
                                                  </DialogDescription>
                                        </DialogHeader>
                                        <div className='text-center'>
                                                  {isFetching ? <LoaderCircle className='animate-spin' /> :
                                                            requests.length > 0 ? requests.map((request, index) => (
                                                                      <div key={index} className='bg-gray-100 rounded grid gap-2 text-sm p-3 relative'>
                                                                                <span className='absolute top-1.5 right-1.5 text-xs text-gray-500'>
                                                                                          {formatDate(request.startDate)} - {formatDate(request.endDate)}
                                                                                </span>
                                                                                          <p className='inline-flex items-center gap-1.5 font-semibold text-sm'><CalendarCheck size={18} /> {request.eventName}</p>
                                                                                          <p className='inline-flex items-center gap-1.5'><MapPin size={18} /> <span className='text-gray-500'>{request.eventLocation}</span></p>
                                                                                          <p className='inline-flex items-center gap-1.5'><Car size={18} /> <span>{request.vehicle.model} - {request.vehicle.licensePlate}</span></p>
                                                                                          <p className='inline-flex items-center gap-1.5'><User size={18} /> <span>{request.requestor.lastName}, {request.requestor.firstName}</span></p>

                                                                      </div>
                                                            )) :
                                                                      <p className='font-semibold text-gray-400'>No events found</p>
                                                  }
                                        </div>
                              </DialogContent>
                    </Dialog>
          )
}
