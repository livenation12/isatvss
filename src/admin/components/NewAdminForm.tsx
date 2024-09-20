import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useFetch from "@/hooks/useFetch"
import { SubmitHandler, useForm } from "react-hook-form"

interface AuthForm {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string
}

export default function NewAdminForm() {
  const { register, handleSubmit, formState: { errors, isLoading }, reset } = useForm<AuthForm>()
  const onSubmit: SubmitHandler<AuthForm> = async (data) => {
    try {
      const response = await useFetch("/auth/create", { body: data, method: 'POST' })
      if (response) {
        reset()
      }
    } catch (error) {
      console.error(error);
    }
  }
  const validatePassword = (value: string) => {
    return value === 'password' || "Your passwords do not match."
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
      <Label className="text-sm">First name</Label>
      <Input {...register("firstName", { required: "Firstname is required." })} />
      <p className="text-xs text-red-500">{errors.firstName?.message}</p>
      <Label className="text-sm">Last name</Label>
      <Input {...register("lastName", { required: "Last name is required." })} />
      <p className="text-xs text-red-500">{errors.lastName?.message}</p>
      <Label className="text-sm">Email</Label>
      <Input {...register("email", { required: "Email is required." })} />
      <p className="text-xs text-red-500">{errors.email?.message}</p>
      <Label className="text-sm">Password</Label>
      <Input type="password" {...register("password", {
        required: "Password is required.", minLength: {
          value: 8,
          message: "Password must be at least 8 characters long."
        }
      })} />
      <p className="text-xs text-red-500">{errors.password?.message}</p>
      <Label className="text-sm">Confirm Password</Label>
      <Input type="password" {...register("confirmPassword", {
        required: "Confirm Password is required.",
        validate: validatePassword
      })} />
      <p className="text-xs text-red-500">{errors.confirmPassword?.message}</p>
      <Button type="submit" isLoading={isLoading}>Create</Button>
    </form>
  )
}
