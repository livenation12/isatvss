import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import UserRoot from './user/features/UserRoot.tsx';
import Home from './user/features/Home.tsx';
import Calendar from './user/features/CalendarRequest.tsx';
import PageNotFound from './user/features/PageNotFound.tsx';
import Vehicles from './user/features/Vehicles.tsx';
import Gate from './admin/features/Gate.tsx';
import Dashboard from './admin/features/Dashboard.tsx';
import Login from './user/features/Login.tsx';
import { Toaster } from './components/ui/toaster.tsx';
import AdminRoot from './admin/features/AdminRoot.tsx';
import AdminVehicles from './admin/features/AdminVehicles.tsx';
import AdminVehicleDetails from './admin/features/AdminVehicleDetails.tsx';
import AdminUsers from './admin/features/AdminUsers.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import ProtectedRoutes from './user/components/ProtectedRoutes.tsx';
import { CalendarProvider } from './user/contexts/CalendarContext.tsx';
import UserRequests from './user/features/UserRequests.tsx';
import AdminRequests from './admin/features/AdminRequests.tsx';
import { RequestProvider } from './admin/contexts/RequestContext.tsx';
// import PrivateRoutes from './admin/components/PrivateRoutes.tsx';
import { VehicleProvider } from './admin/contexts/VehicleContext.tsx';
import { UserProvider } from './admin/contexts/UserContext.tsx';
import AdminUserDetails from './admin/features/AdminUserDetails.tsx';
import AccountCreate from './user/features/AccountCreate.tsx';
import InviteRoutes from './user/components/InviteRoutes.tsx';
const router = createBrowserRouter([
  {
    path: '/',
    element: <UserRoot />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'home',
        element: <Home />
      },
      {
        path: 'calendar',
        element:
          <ProtectedRoutes>
            <CalendarProvider>
              <Calendar />
            </CalendarProvider>
          </ProtectedRoutes>
      },
      {
        path: 'vehicles',
        element:
          <ProtectedRoutes>
            <Vehicles />
          </ProtectedRoutes>
      },
      {
        path: 'requests',
        element:
          <ProtectedRoutes>
            <UserRequests />
          </ProtectedRoutes>
      },
      {
        path: '*',
        element: <PageNotFound />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/admin',
    element:
      // <PrivateRoutes>
        <AdminRoot />
      // </PrivateRoutes>
      ,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'vehicles',
        element:
          <VehicleProvider>
            <AdminVehicles />
          </VehicleProvider>
      },
      {
        path: 'vehicles/:vehicleId',
        element:
          <VehicleProvider>
            <AdminVehicleDetails />
          </VehicleProvider>
      },
      {
        path: 'users',
        element:
          <UserProvider>
            <AdminUsers />
          </UserProvider>
      },
      {
        path: 'users/:userId',
        element:
          <UserProvider>
            <AdminUserDetails />
          </UserProvider>
      },
      {
        path: 'requests',
        element:
          <RequestProvider>
            <AdminRequests />
          </RequestProvider>
      },
      {
        path: '*',
        element: <PageNotFound />
      }
    ]
  },
  {
    path: '/admin/gate',
    element: <Gate />
  },
  {
    path: '/create-account',
    element:
      <InviteRoutes>
        <AccountCreate />
      </InviteRoutes>
  },

])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Toaster />
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
