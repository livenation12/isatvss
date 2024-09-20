import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { UserLogin } from '@/interfaces/user.interface'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Switch } from '@/components/ui/switch'
import useFetch from '@/hooks/useFetch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { useLocation, useNavigate } from 'react-router-dom'

export default function AccountCreate() {
          const location = useLocation()
          const navigate = useNavigate()
          const { toast } = useToast()
          const [isShown, setIsShown] = useState(false)
          const { register, handleSubmit, setError, formState: { errors }, reset } = useForm<UserLogin>({})
          const searchParams = new URLSearchParams(location.search)
          const token = searchParams.get('token')
          const onSubmit: SubmitHandler<UserLogin> = async (data) => {
                    try {
                              const response = await useFetch('/auth/', { body: { ...data, token }, method: 'POST' })
                              if (response.success) {
                                        toast({ title: 'Account Created!', description: 'Your account has been created, you can now use VSS' })
                                        reset()
                                        navigate('/')
                              } else {
                                        setError(response.field, { type: "custom", message: response.message });
                              }
                    } catch (error) {
                              console.log(errors);

                    }
          }
          return (
                    <div className='min-h-max h-screen min-w-max w-screen'>

                              <div className="container flex justify-center">
                                        <Card className='md:min-w-[600px] my-2'>
                                                  <CardHeader>
                                                            <CardTitle className='text-3xl font-semibold'>
                                                                      VSS Account Creation
                                                            </CardTitle>
                                                  </CardHeader>
                                                  <CardContent>
                                                            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
                                                                      <p className='text-xs text-red-500 ms-1'>{errors.email?.message}</p>
                                                                      <Label className='font-semibold'>First name</Label>
                                                                      <Input {...register('firstName', { required: true })} placeholder="First name" />
                                                                      <p className='text-xs text-red-500 ms-1'>{errors.firstName?.message}</p>
                                                                      <Label className='font-semibold'>Last name</Label>
                                                                      <Input {...register('lastName', { required: true })} placeholder="Last name" />
                                                                      <p className='text-xs text-red-500 ms-1'>{errors.lastName?.message}</p>
                                                                      <Label className='font-semibold'>Organization</Label>
                                                                      <Input {...register('organization', { required: true })} placeholder="Organization" />
                                                                      <p className='text-xs text-red-500 ms-1'>{errors.organization?.message}</p>
                                                                      <Label className='font-semibold'>Password</Label>
                                                                      <Input type={isShown ? 'text' : 'password'} {...register('password', { required: true })} placeholder="Password" />
                                                                      <p className='text-xs text-red-500 ms-1'>{errors.password?.message}</p>
                                                                      <Label className='font-semibold'>Confirm Password</Label>
                                                                      <Input type={isShown ? 'text' : 'password'} {...register('confirmPassword', { required: true })} placeholder="Confirm Password" />
                                                                      <p className='text-xs text-red-500 ms-1'>{errors.confirmPassword?.message}</p>
                                                                      <div className='inline-flex justify-end items-center gap-3'><Switch onClick={() => setIsShown(!isShown)} /> <span className='text-sm'>{isShown ? 'Hide Password' : 'Show Password'}</span></div>
                                                                      <Button type="submit">Create</Button>
                                                            </form>
                                                  </CardContent>
                                        </Card>

                              </div>
                    </div>

          )
}
