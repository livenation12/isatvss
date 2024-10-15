import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function UserRoot() {
  return (
    <div>
      <Navbar />
      <main className="w-screen h-[90vh] min-w-max min-h-[90vh]">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  )
}
