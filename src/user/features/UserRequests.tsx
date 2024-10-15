import useFetch from "@/hooks/useFetch"
import { useEffect, useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import { Requests } from "@/interfaces/requests.interface"
import NoRequest from "../../assets/planschedule.png"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from "@/helper"
import { Button } from "@/components/ui/button"
import { Calendar, Footprints } from "lucide-react"
export default function UserRequests() {
  const [requests, setRequests] = useState<Requests[]>([]);
  const { state } = useAuth();
  const [isUpdated, setIsUpdated] = useState(false);
  const [isRowLoading, setIsRowLoading] = useState('')
  const status = [
    { type: 'pending', data: requests.filter(request => request.status === 'Pending') },
    { type: 'approved', data: requests.filter(request => request.status === 'Approved') },
    { type: 'rejected', data: requests.filter(request => request.status === 'Rejected') },
    { type: 'cancelled', data: requests.filter(request => request.status === 'Cancelled') },
    { type: 'completed', data: requests.filter(request => request.status === 'Completed') }
  ]
  const handleCancelRequest = async (id: string) => {
    setIsRowLoading(id)
    try {
      const response = await useFetch(`/requests/${id}/status/cancel`, {
        method: 'PATCH',
        body: { status: 'Cancelled' }
      })
      if (response) {
        setIsUpdated(!isUpdated)
      }
    } catch (error) {
      console.log(error);

    } finally {
      setIsRowLoading('')
    }
  }

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await useFetch(`/requests/${state.user?.id}`, {});
        if (response) {
          setRequests(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchRequest();
  }, [state.user?.id, isUpdated]); // Add dependency on user ID

  return (
    <div className="container">
      <Tabs className="flex flex-col items-center w-full" defaultValue="pending">
        <TabsList className="w-full">
          {status.map(({ type }) => (
            <TabsTrigger key={type} value={type} className="w-full">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
        {status.map(({ type, data }) => (
          <TabsContent key={type} value={type} className="w-full">
            <Table className="bg-white rounded">
              <TableBody>
                {data.length > 0 ?
                  data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex gap-1.5 relative">
                          <img src={`${import.meta.env.VITE_UPLOAD_URL}/vehicles/${item.vehicle.images[0]}`} alt="" width={250} />
                          <div className="flex flex-col gap-1.5">
                            <p className="font-semibold inline-flex items-center gap-1.5"><Calendar size={16} /> {formatDate(item.startDate)} <span className="text-sm font-normal text-gray-500">to</span> {formatDate(item.endDate)}</p>
                            <p className="font-semibold inline-flex items-center gap-1.5"><Footprints size={16} />{item.eventLocation}</p>
                            <p className="text-sm text-gray-500">{item.eventDescription}</p>
                          </div>
                          {item.status === 'Pending' && <Button variant='destructive' loadingText="Canceling" isLoading={isRowLoading === item._id} onClick={() => handleCancelRequest(item._id)} className="absolute right-1 bottom-1">Cancel request</Button>
                          }
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                  : (
                    <TableRow>
                      <TableCell>
                        <figure>
                          <figcaption className="text-center mt-8 text-xl">No {type} requests</figcaption>
                          <img className="mx-auto my-10" src={NoRequest} alt="No request" />
                        </figure>
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
