import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import useFetch from "@/hooks/useFetch";
import { Label } from "@/components/ui/label";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { EyeIcon, EyeOffIcon, Lock, UserCheck, UserCog } from "lucide-react";
import { UserLogin } from "@/interfaces";

interface LocationState {
          from?: Location;
}

export default function Login() {
          const navigate = useNavigate();
          const location = useLocation();
          const { handleSubmit, register, setError, formState: { errors } } = useForm<UserLogin>();
          const { dispatch } = useAuth();
          const [isPasswordShown, setIsPasswordShown] = useState(false)
          const onSubmit: SubmitHandler<UserLogin> = async (data) => {
                    const response = await useFetch('/auth/login', { body: data, method: 'POST' });
                    if (response.success) {
                              // Redirect to the location saved in state, or default to home
                              const redirectTo = (location.state as LocationState)?.from?.pathname || '/';
                              navigate(redirectTo, { replace: true });
                              dispatch({ type: "LOGIN", payload: response.data });
                    } else {
                              setError(response.field, { type: "custom", message: response.message });
                    }
          };
          return (
                    <div>
                              <div className="flex justify-between mx-10">
                                        <Link to={'/home'} className="inline-flex p-3 my-2 bg-blue-900 text-white mx-3 rounded-full text-sm justify-center font-semibold">Vehicle Scheduling System</Link>
                                        <Link to={'/admin/gate'} className="inline-flex gap-x-1.5 p-3 my-2 bg-white text-blue-900 mx-3 rounded-full text-sm justify-center font-semibold"><UserCog size={20} /> Login as admin</Link>
                              </div>
                              <div className="flex flex-col justify-center items-center">
                                        <div className="flex flex-col justify-center mt-10 bg-white items-center shadow-md">
                                                  <h2 className="text-2xl font-semibold w-full text-center bg-gray-100 p-3">
                                                            VSS Login
                                                  </h2>
                                                  <form className="flex flex-col gap-1.5 w-[400px] px-3 py-5" onSubmit={handleSubmit(onSubmit)}>
                                                            <div>
                                                                      <Label className="ms-1 font-semibold">Email</Label>
                                                                      <Input type="email" startIcon={<UserCheck size={18} />} autoFocus {...register("email", { required: "Email is required." })} placeholder="Enter your email" />
                                                                      <p className="text-red-500 ms-2 text-xs">{errors.email?.message}</p>
                                                            </div>
                                                            <div>
                                                                      <Label className="ms-1 font-semibold">Password</Label>
                                                                      <Input startIcon={<Lock size={18} />} type={isPasswordShown ? 'text' : 'password'} {...register("password", { required: "Password is required." })} endIcon={isPasswordShown ? <EyeOffIcon size={18} onClick={() => setIsPasswordShown(!isPasswordShown)} /> : <EyeIcon size={18} onClick={() => setIsPasswordShown(!isPasswordShown)} />} placeholder="Enter your password" />
                                                                      <p className="text-red-500 ms-2 text-xs">{errors.password?.message}</p>
                                                            </div>

                                                            <Button type="submit"  >Login</Button>
                                                  </form>
                                        </div>
                              </div>
                    </div>
          );
}
