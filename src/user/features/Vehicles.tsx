import useFetch from "@/hooks/useFetch"
import { Vehicle } from "@/interfaces"
import { Car, Users } from "lucide-react"
import { useEffect, useState } from "react"
import Nocar from "@/assets/notfound.png"
export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  useEffect(() => {
    const fetchVehicles = async () => {
      const response = await useFetch('/vehicles', {})
      setVehicles(response.data)
    }
    fetchVehicles()
  }, [])
  return (
    <div className="container my-2 animate-fadeIn duration-500">
      <h2 className="my-3 font-bold text-3xl">Vehicle List</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 container">
        {vehicles.length > 0 ? vehicles.map((vehicle: Vehicle) => (
          <figure key={vehicle._id} className="hover:shadow animate-fadeIn duration-500">
            <img className="rounded-t-lg object-cover w-full min-h-max h-[250px]" src={`${import.meta.env.VITE_UPLOAD_URL}/vehicles/${vehicle.images[0]}`} alt={vehicle.model} />
            <figcaption className="p-3 relative">
              <div>
                <h3 className="text-lg font-semibold">{vehicle.model}</h3>
                <p className="text-sm flex items-center gap-2 uppercase"><Car size={18} /> {vehicle.licensePlate}</p>
                <p className="text-xs flex items-center gap-2"><Users size={15} /> {vehicle.maxCapacity}</p>
              </div>
            </figcaption>
          </figure>

        )) :
          <div className="flex justify-center text-center col-span-full ">
            <figure>
              <img src={Nocar} width={500} alt="No vehicles" />
              <figcaption className="font-semibold text-2xl">No vehicles uploaded yet</figcaption>
            </figure>
          </div>

        }
      </div>

    </div>
  )
}
