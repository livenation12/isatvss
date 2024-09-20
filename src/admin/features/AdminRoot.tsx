import { Outlet } from 'react-router-dom'
import AdminNavbar from '../components/AdminNavbar'
export default function AdminRoot() {
          return (
                    <div className='min-h-screen max-w-screen-2xl'>
                              <AdminNavbar />
                              <main className='container'>
                                        <Outlet />
                              </main>
                    </div>
          )
}
