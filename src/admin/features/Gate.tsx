import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SubmitHandler, useForm, } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import useFetch from "@/hooks/useFetch"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/useAuth"
import { useState } from "react"
import { EyeIcon, EyeOffIcon, Lock, User } from "lucide-react"

interface LoginForm {
  email: String,
  password: String
}

export default function Gate() {
  const { dispatch } = useAuth()
  const navigate = useNavigate()
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const { handleSubmit, register, setError, formState: { errors, isSubmitting } } = useForm<LoginForm>()
  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    const response = await useFetch("/admin/login", { body: data, method: "POST" })
    if (response.success) {
      dispatch({ type: "LOGIN", payload: response.data });
      navigate("/admin");
    } else {
      setError(response.field, { type: "custom", message: response.message })
    }
  }  
  const handleIconClick = () => {
    setIsPasswordShown(!isPasswordShown)
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center mt-10 bg-white items-center shadow-md">
        <h2 className="text-2xl font-semibold w-full text-center bg-gray-100 p-3">
          VSS Admin Login
        </h2>
        <form className="flex flex-col gap-1.5 w-[400px] px-3 py-5" onSubmit={handleSubmit(onSubmit)}>
          <Label className="ms-1 font-semibold">Email</Label>
          <Input autoFocus startIcon={<User size={18} />} {...register("email", { required: "Email is required." })} placeholder="Enter your email" />
          <p className="text-red-500 ms-2 text-xs">{errors.email?.message}</p>
          <Label className="ms-1 font-semibold">Password</Label>
          <Input startIcon={<Lock size={18} />} type={isPasswordShown ? "text" : "password"} endIcon={isPasswordShown ? <EyeIcon size={18} onClick={handleIconClick} /> : <EyeOffIcon size={18} onClick={handleIconClick} />} {...register("password", { required: "Password is required." })} placeholder="Enter your password" />
          <p className="text-red-500 ms-2 text-xs">{errors.password?.message}</p>
          <Button type="submit" isLoading={isSubmitting}>Login</Button>
        </form>
      </div>
    </div >
  )
}
