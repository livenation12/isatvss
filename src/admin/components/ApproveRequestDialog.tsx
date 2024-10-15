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
interface IApproveRequestDialog {
          open: boolean
          setOpen: (open: boolean) => void
          request: Requests;
          isUpdated?: () => void
}

export default function ApproveRequestDialog({ open, setOpen = () => { }, request, isUpdated = () => { } }: IApproveRequestDialog) {
          const [isLoading, setIsLoading] = useState(false)
          const { toast } = useToast()
          const [odoMeter, setOdoMeter] = useState(request.vehicle.odoMeter)
          const handleRequestApprove = async () => {
                    setIsLoading(true)
                    try {
                              const approveRequest = await useFetch(`/requests/${request._id}/status/approve`, {
                                        method: 'PATCH',
                                        body: { odoMeter }
                              })
                              if (approveRequest) {
                                        console.log(approveRequest);

                              }
                              if (approveRequest.success) {
                                        isUpdated()
                                        setOpen(false)
                                        toast({
                                                  title: 'Request updated successfully',
                                                  description: approveRequest.message || `Request of ${approveRequest.data.requestor?.firstName} ${approveRequest.data.requestor?.lastName} been updated successfully`,
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
                                                            <p className="text-xs text-yellow-500">Make sure to update the vehicle odometer for tracking of mileage</p>
                                                  </div>
                                        </div>
                                        <DialogFooter className="flex justify-end gap-1.5">
                                                  <DialogClose>Cancel</DialogClose>
                                                  <Button onClick={handleRequestApprove} loadingText="Approving" isLoading={isLoading}>Approve</Button>
                                        </DialogFooter>
                              </DialogContent>
                    </Dialog>
          )
}
