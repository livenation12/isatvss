import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/helper";
import useFetch from "@/hooks/useFetch";
import { Requests } from "@/interfaces";
import { Calendar, Car, Footprints, User } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
interface IReturnRequestDialog {
          open: boolean
          setOpen: (open: boolean) => void
          request: Requests;
          isUpdated?: () => void
}

export default function ReturnRequestDialog({ open, setOpen = () => { }, request, isUpdated = () => { } }: IReturnRequestDialog) {
          const [isLoading, setIsLoading] = useState(false)
          const { toast } = useToast()
          const [odoMeter, setOdoMeter] = useState(request.vehicle.odoMeter)
          const [error, setError] = useState<string | null>(null)
          const handleRequestReturn = async () => {
                    if(odoMeter <= request.vehicle.odoMeter) {
                              setError('Odometer reading should be greater than previous reading')
                              return
                    }
                    setIsLoading(true)
                    try {
                              const returnedRequest = await useFetch(`/requests/${request._id}/status/return`, {
                                        method: 'PATCH',
                                        body: { odoMeter }
                              })
                              if (returnedRequest) {
                                        console.log(returnedRequest);

                              }
                              if (returnedRequest.success) {
                                        isUpdated()
                                        setOpen(false)
                                        toast({
                                                  title: 'Request updated successfully',
                                                  description: returnedRequest.message || `Request of ${returnedRequest.data.requestor?.firstName} ${returnedRequest.data.requestor?.lastName} been updated successfully`,
                                        })
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
                                                  <DialogTitle>Approve Request</DialogTitle>
                                                  <DialogDescription>
                                                            Are you sure you want to approve this request?
                                                  </DialogDescription>
                                        </DialogHeader>
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
                                                  <div className="space-y-1.5">
                                                            <Label className="font-semibold">Vehicle Odometer</Label>
                                                            <Input defaultValue={request.vehicle.odoMeter} onChange={(e) => setOdoMeter(Number(e.target.value))} />
                                                            {error ? <p className="text-xs text-red-500">{error}</p> : <p className="text-xs text-yellow-500">Make sure to update the vehicle odometer for tracking of mileage</p>
                                                            }
                                                  </div>
                                        </div>
                                        <DialogFooter className="flex justify-end gap-1.5">
                                                  <DialogClose>Cancel</DialogClose>
                                                  <Button onClick={handleRequestReturn} loadingText="Approving" isLoading={isLoading}>Returned vehicle</Button>
                                        </DialogFooter>
                              </DialogContent>
                    </Dialog>
          )
}
