import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogDescription } from "@/components/ui/dialog";
import { formatDate } from "@/helper";
import { Requests } from "@/interfaces";
import { AtSign, Calendar, Car, Flag, Footprints, User } from "lucide-react";
interface IRequestViewDetailsDialog {
          open: boolean
          setOpen: (open: boolean) => void
          request: Requests;
}

export default function RequestViewDetailsDialog({ open, setOpen = () => { }, request }: IRequestViewDetailsDialog) {
          return (
                    <Dialog open={open} onOpenChange={setOpen}>
                              <DialogContent>
                                        <DialogHeader>
                                                  <DialogTitle>Completed Request</DialogTitle>
                                                  <DialogDescription>
                                                            Shown are the full details of the request transaction
                                                  </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex flex-col gap-1.5 relative">
                                                  <span className="absolute top-1 right-1 text-xs text-gray-400">{request.createdAt && formatDate(request.createdAt)}</span>
                                                  <p className="inline-flex items-center gap-1.5 font-semibold"><User size={18} /> {request.requestor.lastName}, {request.requestor.firstName}</p>
                                                  <p className="inline-flex items-center gap-1.5 text-xs text-gray-500"><AtSign size={15} /> {request.requestor.email}</p>
                                                  <p className="inline-flex items-center gap-1.5"><Flag size={18} /> {request.eventName}</p>
                                                  <p className="inline-flex items-center gap-1.5"><Car size={18} /> {request.vehicle.model} - {request.vehicle.licensePlate}</p>
                                                  <p className="inline-flex items-center gap-1.5 text-sm text-gray-500"><Calendar size={18} /> {formatDate(request.startDate)} - {formatDate(request.endDate)} </p>
                                                  <p className="inline-flex items-center gap-1.5 text-sm text-gray-500"><Footprints size={18} /> {(request.deploymentOdometer && request.returnedOdometer) && request.returnedOdometer - request.deploymentOdometer}</p>
                                                  <figure>
                                                            <img src={`${import.meta.env.VITE_UPLOAD_URL}/vehicles/${request.vehicle.images[0]}`} alt={request.vehicle.model}
                                                                      className="w-full max-h-[300px] object-cover" />
                                                  </figure>

                                        </div>
                              </DialogContent>
                    </Dialog>
          )
}
