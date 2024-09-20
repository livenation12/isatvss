import useFetch from "@/hooks/useFetch"
import { useEffect, useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import { Requests } from "@/interfaces/requests.interface"
import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
export default function UserRequests() {
  const [requests, setRequests] = useState<Requests[]>([])
  const { state } = useAuth()
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await useFetch(`/requests/${state.user?.id}`, {})
        if (response) {
          setRequests(response.data)
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchRequest()
  }, [])

  if (requests.length === 0) {
    return (
      <div className="container my-2">
        <h2 className="my-3 font-bold text-xl">No Requests found</h2>
      </div>
    )
  }
  if (requests.length > 0) {
    return (
      <div>
        <div className="container my-2 animate-fadeIn duration-500">
          <h2 className="my-3 font-bold text-xl">Your Requests</h2>
          <div className="container">
            <div className="grid gap-5">
              {requests.map((request) => (
                <div key={request._id} className="grid lg:grid-cols-2 hover:shadow-xl rounded">
                  <section>
                    <div className="flex overflow-y-auto gap-5 rounded">
                      {request.vehicle.images.map((image) => (
                        <img
                          key={image}
                          src={`${import.meta.env.VITE_UPLOAD_URL}/vehicles/${image}`}
                          alt="vehicle"
                          className="max-h-[200px] object-cover"
                        />
                      ))}
                    </div>
                  </section>
                  <section className="flex flex-col px-5 py-2">
                    <h3 className="text-lg font-semibold">Requesting date</h3>
                    <p className="ms-5">{request.startDate} to {request.endDate}</p>
                    <h3 className="text-lg font-semibold">Status</h3>
                    <p className="ms-5 inline-flex">{request.status} </p>
                    <h4 className="font-semibold text-lg">Requesting vehicle</h4>
                    <div className="ms-5">
                      <p>{request.vehicle.model}</p>
                      <p>{request.vehicle.licensePlate}</p>
                      <p className="inline-flex items-center gap-2 font-semibold"><Users size={18} /> {request.vehicle.maxCapacity}</p>
                      {request.status === "Pending" && <Button variant='destructive' className="float-end">Cancel request</Button>}
                      {request.status === "Rejected" &&
                        <div className="flex justify-end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant='outline'>View Reason</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reason of rejection</DialogTitle>
                              </DialogHeader>
                              <p className="italic text-sm my-5">{request.message}</p>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant='outline'>Close</Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      }
                    </div>
                  </section>
                </div>
              )
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
