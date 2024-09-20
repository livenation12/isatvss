import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserCircle } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import useFetch from "@/hooks/useFetch";
import { useAuth } from "../../hooks/useAuth";
export default function Navbar() {
  const { state, dispatch } = useAuth(); // Access state and dispatch from AuthContext  
  
  const links = [
    {
      name: "Home",
      path: "/home"
    },
    {
      name: "Calendar",
      path: "/calendar"
    },
    {
      name: "Vehicles",
      path: "/vehicles"
    },
    {
      name: "Requests",
      path: "/requests",
    }
  ];

  const handleLogout = async () => {
    try {
      const response = await useFetch("/auth/logout", { method: 'GET', credentials: "include" });
      if (response.success) {
        dispatch({ type: "LOGOUT" });
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="sticky flex items-center top-0 left-0 right-0 backdrop-blur z-50 text-sm py-4 text-blue-900">
      <div className="container">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-x-5">
            <Link to='/' className="font-semibold rounded-full border p-3 bg-blue-900 text-white text-center">
              Vehicle Scheduling Services
            </Link>
            {links.map((link, index) => (
              <NavLink key={index} to={link.path} className={({ isActive }) => isActive ? "underline underline-offset-4 text-yellow-400" : "hover:text-yellow-600"}>
                {link.name}
              </NavLink>
            ))}
          </div>
          <div className="flex">
            {state.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <UserCircle />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{state.user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="link">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

    </nav>
  );
}
