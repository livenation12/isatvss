import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useEffect, useState } from 'react'
import { User } from '@/interfaces'
import useFetch from '@/hooks/useFetch'
import { useUser } from '../hooks/useUser'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { useAuth } from '@/hooks/useAuth'
export default function AdminUsers() {
          const { state: authState } = useAuth()
          const [users, setUsers] = useState<User[]>()
          const { state } = useUser()
          const [email, setEmail] = useState<string>('')
          const [isDialogOpen, setIsDialogOpen] = useState(false)
          const [isLoading, setIsLoading] = useState(false)

          useEffect(() => {
                    const fetchUsers = async () => {
                              try {
                                        const response = await useFetch('/users', {})
                                        if (response.success) {
                                                  setUsers(response.data)
                                        }

                              } catch (error) {
                                        console.log(error);

                              }
                    }
                    fetchUsers()

          }, [state.isUpdated])
          const handleUserCreateApplication = async () => {
                    setIsLoading(true)
                    try {
                              const response = await useFetch('/auth/invite', { body: { email, from: authState.user?.id }, method: 'POST' })
                              if (response.success) {
                                        toast({ title: 'Application sent', description: 'Let them check their email and click on the link to verify your email' })
                                        setIsDialogOpen(false)
                              }
                    } catch (error) {
                              console.log(error);

                    } finally {
                              setIsLoading(false)
                    }
          }
          return (
                    <div className='animate-fadeIn duration-700'>
                              <div className='flex justify-end'>
                                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                                  <DialogTrigger asChild>
                                                            <Button>New User</Button>
                                                  </DialogTrigger>
                                                  <DialogContent>
                                                            <DialogHeader>
                                                                      <DialogTitle>Users Email</DialogTitle>
                                                                      <DialogDescription>
                                                                                Enter email to send new user application, Please note that it will be sent to the email and expires within <strong>24 hours</strong>
                                                                      </DialogDescription>
                                                            </DialogHeader>
                                                            <div>
                                                                      <Input id='email' onChange={(e) => setEmail(e.target.value)} placeholder='Enter email' />
                                                            </div>
                                                            <DialogFooter>
                                                                      <Button isLoading={isLoading} onClick={handleUserCreateApplication}>Send</Button>
                                                            </DialogFooter>
                                                  </DialogContent>
                                        </Dialog>
                              </div>
                              <div className='grid lg:grid-cols-3 my-2'>
                                        {
                                                  users && users.length > 0 ? users.map((user) => (
                                                            <Link to={`/admin/users/${user._id}`} key={user._id} className='flex flex-col justify-start items-center hover:shadow hover:-translate-y-1 ease-in transition-all'>
                                                                      <div className='rounded-full bg-blue-900 text-3xl w-5/6 text-center font-semibold text-yellow-400 my-1 p-5'>
                                                                                {user.firstName[0]}{user.lastName[0]}
                                                                      </div>
                                                                      <hr />
                                                                      <div className='self-start px-5 my-2'>
                                                                                <p>{user.lastName}, {user.firstName}</p>
                                                                                <p className='text-xs italic text-gray-400'>{user.email}</p>
                                                                                <p className='font-semibold'>{user.organization}</p>
                                                                      </div>
                                                            </Link>
                                                  )) : 'No users found'

                                        }
                              </div>
                    </div>
          )
}
