import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Requests, StatusTypes } from '@/interfaces';
import useFetch from '@/hooks/useFetch';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import {
          Footprints,
          User,
          Calendar,
          Car,

} from 'lucide-react';
import { formatDate } from '@/helper';
interface RejectDialogProps {
          isUpdated?: () => void;
          request: Requests; // Assuming the id is passed from a parent component
          open: boolean
          setOpen: (open: boolean) => void
}

export default function RejectDialog({
          request,
          isUpdated = () => { },
          open,
          setOpen = () => { },
}: RejectDialogProps) {
          const { toast } = useToast()
          const { state: authState } = useAuth()
          const [message, setMessage] = useState('');
          const [isLoading, setIsLoading] = useState(false);
          const handleResponse = async (status: StatusTypes) => {
                    setIsLoading(true)
                    try {
                              const payload = { status, reviewedBy: authState.user?.id, message }
                              const response = await useFetch(`/requests/${request._id}`, {
                                        method: 'PATCH',
                                        body: payload
                              })
                              if (response.success) {
                                        toast({
                                                  title: 'Request rejected',
                                                  description: `Request of ${response.data.requestor?.firstName} ${response.data.requestor?.lastName} been updated successfully`,
                                        })
                                        isUpdated()
                              }
                    } catch (error) {
                              console.log(error);

                    } finally {
                              setIsLoading(false)
                    }
          }
          return (
                    <Dialog open={open} onOpenChange={setOpen}>
                              <DialogContent>
                                        <DialogHeader>
                                                  <DialogTitle>Reject Request</DialogTitle>
                                                  <DialogDescription>
                                                            Provide a reason for rejecting the request
                                                  </DialogDescription>
                                                  <div className="flex flex-col gap-1.5 relative">
                                                            <span className="absolute top-1 right-1 text-xs text-gray-400">{request.createdAt && formatDate(request.createdAt)}</span>
                                                            <p className="inline-flex items-center gap-1.5 font-semibold"><User size={18} /> {request.requestor.lastName}, {request.requestor.firstName}</p>
                                                            <p className="inline-flex items-center gap-1.5"><Footprints size={18} /> {request.eventName}</p>
                                                            <p className="inline-flex items-center gap-1.5"><Car size={18} /> {request.vehicle.model} - {request.vehicle.licensePlate}</p>
                                                            <p className="inline-flex items-center gap-1.5 text-sm text-gray-500"><Calendar size={15} /> {formatDate(request.startDate)} </p>
                                                            <figure>
                                                                      <img src={`${import.meta.env.VITE_UPLOAD_URL}/vehicles/${request.vehicle.images[0]}`} alt={request.vehicle.model}
                                                                                className="w-full max-h-[300px] object-cover" />
                                                            </figure>
                                                  </div>
                                                  <Textarea
                                                            value={message}
                                                            onChange={(e) => {
                                                                      setMessage(e.target.value);
                                                            }}
                                                            placeholder="Message of rejection"
                                                  />
                                        </DialogHeader>
                                        <DialogFooter className="flex justify-end gap-x-2">
                                                  <DialogClose asChild>
                                                            <Button variant="ghost">Cancel</Button>
                                                  </DialogClose>
                                                  <Button
                                                            variant="destructive"
                                                            isLoading={isLoading}
                                                            loadingText="Rejecting"
                                                            onClick={() => handleResponse('Rejected')}
                                                  >
                                                            Reject
                                                  </Button>
                                        </DialogFooter>
                              </DialogContent>
                    </Dialog>
          );
}
