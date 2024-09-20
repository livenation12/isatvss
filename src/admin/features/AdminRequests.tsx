import { useEffect, useState } from 'react';
import { Requests, StatusTypes } from '@/interfaces/requests.interface';
import useFetch from '@/hooks/useFetch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/helper';
import { useRequest } from '../hooks/useRequest';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
interface StatusRequest {
          pending: Requests[];
          approved: Requests[];
          rejected: Requests[];
}
const STATUS = {
          pending: 'Pending',
          approved: 'Approved',
          rejected: 'Rejected',
};

export default function AdminRequests() {
          const { state, dispatch } = useRequest();
          const { toast } = useToast();
          const { state: authState } = useAuth();
          const [message, setMessage] = useState('')
          const [isLoading, setIsLoading] = useState(false)
          const initialRequestState: StatusRequest = {
                    pending: [],
                    approved: [],
                    rejected: [],
          };


          const [requests, setRequests] = useState<StatusRequest>(initialRequestState);

          const status = [
                    { type: 'pending', data: requests.pending },
                    { type: 'approved', data: requests.approved },
                    { type: 'rejected', data: requests.rejected },
          ];


          useEffect(() => {
                    const fetchRequest = async () => {
                              try {
                                        const response = await useFetch('/requests', {});
                                        if (response && response.data) {
                                                  const categorizedItems: StatusRequest = {
                                                            pending: [],
                                                            approved: [],
                                                            rejected: [],
                                                  };

                                                  response.data.forEach((item: Requests) => {
                                                            if (item.status === STATUS.pending) {
                                                                      categorizedItems.pending.push(item);
                                                            } else if (item.status === STATUS.approved) {
                                                                      categorizedItems.approved.push(item);
                                                            } else if (item.status === STATUS.rejected) {
                                                                      categorizedItems.rejected.push(item);
                                                            }
                                                  });

                                                  setRequests(categorizedItems); // No need to spread previous state since we're replacing it
                                        }
                              } catch (error) {
                                        console.error(error);
                              }
                    };

                    fetchRequest();
          }, [state.isUpdated]);

          const handleResponse = async (id: string, status: StatusTypes) => {
                    setIsLoading(true)
                    try {
                              const payload = { status, reviewedBy: authState.user?.id, message }
                              const response = await useFetch(`/requests/${id}`, {
                                        method: 'PATCH',
                                        body: payload
                              })
                              if (response.success) {
                                        dispatch({ type: 'IS_UPDATED' })
                                        toast({
                                                  title: 'Request updated successfully',
                                                  description: `Request of ${response.data.requestor?.firstName} ${response.data.requestor?.lastName} been updated successfully`,
                                        })
                              }
                    } catch (error) {
                              console.log(error);

                    } finally {
                              setIsLoading(false)
                    }
          }
          return (
                    <div className="container animate-fadeIn duration-500">
                              <h3 className="text-3xl font-semibold">Requests</h3>
                              <Tabs defaultValue="pending" className="flex flex-col items-center">

                                        <TabsList className="py-5 shadow-inner flex w-full">
                                                  {status.map((stat, index) => (
                                                            <TabsTrigger className="capitalize w-full" value={stat.type} key={index}>
                                                                      {stat.type}
                                                            </TabsTrigger>
                                                  ))}
                                        </TabsList>

                                        {status.map((stat, index) => (
                                                  <TabsContent className="w-full" value={stat.type} key={index}>
                                                            <Table>
                                                                      <TableBody>
                                                                                {stat.data.length ? (
                                                                                          stat.data.map((request) => (
                                                                                                    <TableRow key={request._id}>
                                                                                                              <TableCell className='font-semibold'>
                                                                                                                        {request.requestor?.firstName} {request.requestor?.lastName}
                                                                                                              </TableCell>
                                                                                                              <TableCell>
                                                                                                                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                                                                                                              </TableCell>
                                                                                                              <TableCell className='font-semibold'>
                                                                                                                        {request.vehicle?.licensePlate}
                                                                                                              </TableCell>
                                                                                                              <TableCell className='inline-flex gap-2'>
                                                                                                                        {request.status === STATUS.pending && (
                                                                                                                                  <>
                                                                                                                                            <Button isLoading={isLoading} loadingText='Approving' onClick={() => handleResponse(request._id, 'Approved')} className='text-xs' size={'sm'}>Approve</Button>

                                                                                                                                            <Dialog>
                                                                                                                                                      <DialogTrigger asChild>
                                                                                                                                                                <Button className='text-xs' size={'sm'} variant={'destructive'}>Reject</Button>
                                                                                                                                                      </DialogTrigger>
                                                                                                                                                      <DialogContent>
                                                                                                                                                                <DialogHeader>
                                                                                                                                                                          <DialogTitle>
                                                                                                                                                                                    Reject Request
                                                                                                                                                                          </DialogTitle>
                                                                                                                                                                          <DialogDescription>
                                                                                                                                                                                    Provide a reason for rejecting the request
                                                                                                                                                                          </DialogDescription>
                                                                                                                                                                          <Textarea onChange={(e) => setMessage(e.target.value)} placeholder='Message' />
                                                                                                                                                                </DialogHeader>
                                                                                                                                                                <DialogFooter className='flex justify-end gap-x-2'>
                                                                                                                                                                          <DialogClose asChild>
                                                                                                                                                                                    <Button variant='ghost'>Cancel</Button>
                                                                                                                                                                          </DialogClose>
                                                                                                                                                                          <Button variant='destructive' isLoading={isLoading} loadingText='Rejecting' onClick={() => handleResponse(request._id, 'Rejected')}>Reject</Button>
                                                                                                                                                                </DialogFooter>
                                                                                                                                                      </DialogContent>
                                                                                                                                            </Dialog>
                                                                                                                                  </>
                                                                                                                        )
                                                                                                                        }

                                                                                                              </TableCell>
                                                                                                    </TableRow>
                                                                                          ))
                                                                                ) : (
                                                                                          <TableRow>
                                                                                                    <TableCell colSpan={4} className='text-center'>
                                                                                                              There's nothing in here
                                                                                                    </TableCell>
                                                                                          </TableRow>
                                                                                )}
                                                                      </TableBody>
                                                            </Table>
                                                  </TabsContent>
                                        ))}
                              </Tabs>
                    </div>
          );
}
