import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import useFetch from "@/hooks/useFetch";
import { NavLink, Link } from "react-router-dom";
import useUserStorage from "@/hooks/useUserStorage";
import { UserRoundCogIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
export default function AdminNavbar() {
          const { state, dispatch } = useAuth()
          const [_, setUser] = useUserStorage()
          const links = [
                    {
                              name: "Dashboard",
                              path: "dashboard"
                    },
                    {
                              name: "Vehicles",
                              path: "vehicles"
                    },
                    {
                              name: "Requests",
                              path: "requests"
                    },
                    {
                              name: "Users",
                              path: "users"
                    },
          ]
          const handleLogout = async () => {
                    const response = await useFetch("/auth/logout", {})
                    if (response.success) {
                              dispatch({ type: "LOGOUT" })
                              setUser(null)
                    }
          }

          return (
                    <nav className="sticky flex items-center top-0 left-0 right-0 backdrop-blur z-50 text-sm py-4 text-blue-900">
                              <div className="container">
                                        <div className="flex justify-between items-center w-full">
                                                  <div className="flex items-center gap-x-5">
                                                            <Link to='' className="font-semibold rounded-full border p-3 bg-blue-900 text-white text-center">
                                                                      VSS Administrator

                                                            </Link>
                                                            {links.map((link, index) => (
                                                                      <NavLink key={index} to={link.path} className={({ isActive }) => isActive ? "underline underline-offset-4 text-yellow-400" : "hover:text-yellow-600"}>
                                                                                {link.name}
                                                                      </NavLink>
                                                            ))}
                                                  </div>
                                                  <DropdownMenu>
                                                            <DropdownMenuTrigger>
                                                                      <UserRoundCogIcon />
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent>
                                                                      <DropdownMenuLabel>{state.user?.email}</DropdownMenuLabel>
                                                                      <DropdownMenuSeparator />
                                                                      <DropdownMenuItem onClick={() => handleLogout()}>Logout</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                  </DropdownMenu>
                                        </div>
                              </div>
                    </nav>
          )
}
