import { Button } from '@/components/ui/button'
import useFetch from '@/hooks/useFetch'
import { Requests, User } from '@/interfaces'
import { ArrowLeft, User2Icon, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import RejectDialog from '../components/RejectRequestDialog'
import { formatDate } from '@/helper'
import ApproveRequestDialog from '../components/ApproveRequestDialog'
export default function AdminUserDetails() {
          const navigate = useNavigate()
          const { toast } = useToast()
          const { userId } = useParams()
          const [userDetails, setUserDetails] = useState<User>()
          const [userRequests, setUserRequests] = useState<Requests[]>()
          const { reset } = useForm({ defaultValues: {} });
          const [isDeleting, setIsDeleting] = useState(false)
          const [activeView, setActiveView] = useState<Requests['_id']>('')
          const [openRowApproveDialog, setOpenRowApproveDialog] = useState(false)
          const [openRowRejectDialog, setOpenRowRejectDialog] = useState(false)
          const [isUpdatedRequests, setIsUpdatedRequests] = useState(false)
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

          const handleUserDelete = async (userId: string) => {
                    setIsDeleting(true)
                    try {
                              const response = await useFetch(`/users/${userId}`, {
                                        method: 'DELETE'
                              })
                              if (response.success) {
                                        toast({
                                                  title: 'User deleted successfully',
                                        })
                                        navigate('/admin/users')
                              }
                    } catch (error) {
                              console.log(error);

                    } finally {
                              setIsDeleting(false)
                    }
          }
          const handleActiveRequest = async (id: Requests['_id'], type: 'Approve' | 'Reject') => {
                    setActiveView(id)
                    if (type === 'Approve') {
                              setOpenRowApproveDialog(true)
                    } else {
                              setOpenRowRejectDialog(true)
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
          }, [])

          useEffect(() => {
                    fetchUserRequests()
          }, [isUpdatedRequests])

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
                                                                                <DialogContent>
                                                                                          <DialogHeader>
                                                                                                    <DialogTitle>
                                                                                                              Delete confirmation
                                                                                                    </DialogTitle>

                                                                                          </DialogHeader>
                                                                                          <p className='italic text-gray-500 text-sm'>Are you sure to delete this user?</p>
                                                                                          <DialogFooter>
                                                                                                    <DialogClose asChild>
                                                                                                              <Button variant='ghost'>Cancel</Button>
                                                                                                    </DialogClose>
                                                                                                    <Button loadingText='Deleting' isLoading={isDeleting} onClick={() => handleUserDelete(userDetails._id)} variant='destructive'>Delete</Button>
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
                                                                                                              {request.vehicle.model} -
                                                                                                              {request.vehicle.licensePlate}
                                                                                                    </TableCell>
                                                                                                    <TableCell className='flex'>
                                                                                                              {formatDate(request.startDate)} - {formatDate(request.endDate)}
                                                                                                    </TableCell>
                                                                                                    {

                                                                                                              request.status === 'Pending' && (
                                                                                                                        <TableCell className='inline-flex gap-1.5'>
                                                                                                                                  {
                                                                                                                                            (request._id === activeView && openRowApproveDialog) &&
                                                                                                                                            <ApproveRequestDialog open={openRowApproveDialog}
                                                                                                                                                      setOpen={setOpenRowApproveDialog}
                                                                                                                                                      request={request}
                                                                                                                                                      isUpdated={() => setIsUpdatedRequests(!isUpdatedRequests)} />
                                                                                                                                  }
                                                                                                                                  {
                                                                                                                                            (request._id === activeView && openRowRejectDialog) &&
                                                                                                                                            <RejectDialog open={openRowRejectDialog}
                                                                                                                                                      setOpen={setOpenRowRejectDialog}
                                                                                                                                                      request={request} />
                                                                                                                                  }
                                                                                                                                  <Button
                                                                                                                                            onClick={() => handleActiveRequest(request._id, "Approve")}
                                                                                                                                            className='text-xs' size={'sm'}>Approve
                                                                                                                                  </Button>
                                                                                                                                  <Button variant='destructive'
                                                                                                                                            onClick={() => handleActiveRequest(request._id, "Reject")}
                                                                                                                                            className='text-xs' size={'sm'}>Reject
                                                                                                                                  </Button>
                                                                                                                        </TableCell>
                                                                                                              )
                                                                                                    }
                                                                                          </TableRow>
                                                                                )) : (
                                                                                          <TableRow>
                                                                                                    <TableCell colSpan={4}>No requests</TableCell>
                                                                                          </TableRow>
                                                                                )
                                                                      }
                                                            </TableBody>
                                                  </Table>
                                        </div>
                              </div>
                    </>
          )
}
