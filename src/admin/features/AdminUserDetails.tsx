import { Button } from '@/components/ui/button'
import useFetch from '@/hooks/useFetch'
import { Requests, User } from '@/interfaces'
import { ArrowLeft, Trash, User2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { useForm } from 'react-hook-form'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

export default function AdminUserDetails() {
          const { userId } = useParams()
          const [userDetails, setUserDetails] = useState<User>()
          const [userRequests, setUserRequests] = useState<Requests[]>()
          const { reset } = useForm({ defaultValues: {} });
          const fetchUserDetails = async () => {
                    try {
                              const response = await useFetch(`/users/${userId}`, {})
                              if (response.success) {
                                        setUserDetails(response.data)
                              }
                    } catch (error) {
                              console.log(error);

                    }
          }
          const fetchUserRequests = async () => {
                    try {
                              const response = await useFetch(`/requests/${userId}`, {})
                              if (response.success) {
                                        setUserRequests(response.data)
                              }
                    } catch (error) {
                              console.log(error);

                    }
          }
          useEffect(() => {
                    fetchUserDetails()
                    fetchUserRequests()
          }, [])
          useEffect(() => {
                    if (userDetails) {
                              reset(userDetails); // Update form values with fetched data
                    }
          }, [userDetails, reset]);

          return (
                    <>

                              <Link to='/admin/users' className='font-semibold inline-flex gap-x-1.5'> <ArrowLeft /> Back to users</Link>

                              <div className='animate-fadeIn duration-700 grid lg:grid-cols-2 gap-5'>

                                        {userDetails && (
                                                  <div className="flex flex-col justify-center">
                                                            <h2 className='text-3xl font-semibold'>User Details</h2>
                                                            <div className='my-3 mx-5 text-center space-y-1'>
                                                                      <div className='flex justify-center text-center'>
                                                                                <User2Icon size={108} />
                                                                      </div>
                                                                      <p className='text-2xl font-semibold'>{userDetails.lastName}, {userDetails.firstName}</p>
                                                                      <p className='italic text-gray-500'>{userDetails.email}</p>
                                                                      <p className='text-xl font-semibold'>{userDetails.organization}</p>
                                                            </div>
                                                            <div className='my-2 flex ms-3 gap-x-1.5'>
                                                                      <Dialog>
                                                                                <DialogTrigger asChild>
                                                                                          <Button variant='destructive'><Trash className='me-1.5' size={15} /> Delete user</Button>
                                                                                </DialogTrigger>
                                                                                <DialogContent className="bg-red-200">
                                                                                          <DialogHeader>
                                                                                                    <DialogTitle>
                                                                                                              Delete confirmation
                                                                                                    </DialogTitle>

                                                                                          </DialogHeader>
                                                                                          <p className='italic'>Are you sure to delete this user?</p>
                                                                                          <DialogFooter>
                                                                                                    <DialogClose asChild>
                                                                                                              <Button variant='ghost'>Cancel</Button>
                                                                                                    </DialogClose>
                                                                                                    <Button variant='destructive'>Delete</Button>
                                                                                          </DialogFooter>
                                                                                </DialogContent>
                                                                      </Dialog>
                                                            </div>
                                                  </div>
                                        )}
                                        <div>
                                                  <h2 className='text-3xl font-semibold'>User Requests</h2>
                                                  <Table className='my-2'>
                                                            <TableBody>
                                                                      {
                                                                                userRequests && userRequests.length > 0 ? userRequests.map((request) => (
                                                                                          <TableRow key={request._id} className='flex items-center hover:bg-gray-100 hover:cursor-pointer duration-300 rounded'>
                                                                                                    <TableCell className='text-gray-400'>
                                                                                                              {request.status}
                                                                                                    </TableCell>
                                                                                                    <TableCell className='inline-flex gap-x-2 font-semibold'>
                                                                                                              <p>{request.vehicle.model}</p>
                                                                                                              <p>{request.vehicle.licensePlate}</p>
                                                                                                    </TableCell>
                                                                                                    <TableCell className='flex'>
                                                                                                              <p>{request.startDate} - {request.endDate}</p>
                                                                                                    </TableCell>
                                                                                          </TableRow>
                                                                                )) : 'No requests found'
                                                                      }
                                                            </TableBody>
                                                  </Table>


                                        </div>
                              </div>
                    </>
          )
}
