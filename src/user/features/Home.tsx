import School from "../../assets/samplebg.jpg"
import { Link } from "react-router-dom"
export default function Home() {

  return (
    <div className='relative'>
      <img src={School} alt="Students image" className='h-[500px] w-full object-cover' />
      <div className='flex h-20 w-full justify-center gap-x-5'>
        <Link to="/vehicles" className="hover:-translate-y-2 transition-all ease-out">
          <div className='link-card'>
            <h3 className="text-lg">Schedule</h3>
            <p className="text-xs text-gray-300">
              Inquire your needed vehicle for your event.
            </p>
          </div>
        </Link>
        <Link to="/vehicles" className="hover:-translate-y-2 transition-all ease-out">
          <div className="link-card">
            <h3 className="text-lg">Vehicles</h3>
            <p className="text-xs text-gray-300">
              Inquire your needed vehicle for your event.
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
