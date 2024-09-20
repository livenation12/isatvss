import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import VehicleForm from "../components/VehicleForm"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Vehicle } from "@/interfaces"
import { Car, Users } from "lucide-react"
import useFetch from "@/hooks/useFetch"
import { Link } from "react-router-dom"
export default function AdminVehicles() {
          const [vehicles, setVehicles] = useState<Vehicle[]>([])
          useEffect(() => {
                    const fetchVehicles = async () => {
                              const response = await useFetch('/vehicles', {})
                              setVehicles(response.data)
                    }
                    fetchVehicles()
          }, [])
          return (
                    <div className="container space-y-2 animate-fadeIn duration-700">
                              <div className="flex justify-between items-center">
                                        <h2 className="text-3xl font-semibold">Vehicle List</h2>
                                        <Dialog>
                                                  <DialogTrigger asChild>
                                                            <Button className=""> Add Vehicle</Button>
                                                  </DialogTrigger>
                                                  <DialogContent>
                                                            <DialogHeader>
                                                                      <DialogTitle>Vehicle Form</DialogTitle>
                                                                      <DialogDescription className="text-sm text-gray-500">
                                                                                Add new vehicle that will be available for faculty events
                                                                      </DialogDescription>
                                                            </DialogHeader>
                                                            <VehicleForm />
                                                  </DialogContent>
                                        </Dialog>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                        {vehicles.map((vehicle: Vehicle) => (
                                                  <Link to={`/admin/vehicles/${vehicle._id}`} key={vehicle._id}>
                                                            <figure className="hover:shadow hover:-translate-y-1 transition-all ease-in">
                                                                      <img className="object-cover w-full max-h-[200px] min-h-[200px]" src={`${import.meta.env.VITE_UPLOAD_URL}/vehicles/${vehicle.images[0]}`} alt={vehicle.model} />
                                                                      <figcaption className="p-3 relative">
                                                                                <div>
                                                                                          <h3 className="text-lg font-semibold">{vehicle.model}</h3>
                                                                                          <p className="text-sm flex items-center gap-2 uppercase"><Car size={18} /> {vehicle.licensePlate}</p>
                                                                                          <p className="text-xs flex items-center gap-2"><Users size={15} /> {vehicle.maxCapacity}</p>
                                                                                </div>
                                                                      </figcaption>
                                                            </figure>
                                                  </Link>
                                        ))}
                              </div>
                    </div>
          )
}
