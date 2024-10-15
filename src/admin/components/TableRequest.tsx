import { Table, TableBody, TableRow, TableCell, TableFooter } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/helper';
import RejectRequestDialog from './RejectRequestDialog';
import { Ellipsis } from 'lucide-react';
import { Requests } from '@/interfaces/requests.interface';
import { useRequest } from '../hooks/useRequest';
import { useState } from 'react';
import { STATUS } from '../features/AdminRequests';
import ApproveRequestDialog from './ApproveRequestDialog';
import ReturnRequestDialog from './ReturnRequestDialog';
import RequestViewDetailsDialog from './RequestViewDetailsDialog';
interface ITableRequestProps {
          stat: {
                    data: Requests[]
                    type: string
          }
}
export default function TableRequest({ stat }: ITableRequestProps) {
          const { dispatch } = useRequest();
          const [activeView, setActiveView] = useState<Requests['_id']>('')
          const [openRowApproveDialog, setOpenRowApproveDialog] = useState(false)
          const [openRowRejectDialog, setOpenRowRejectDialog] = useState(false)
          const [openRowReturnDialog, setOpenRowReturnDialog] = useState(false)
          const [openRowDetailsDialog, setOpenRowDetailsDialog] = useState(false)
          const handleActionClick = async (id: Requests['_id'], type: 'Approve' | 'Reject' | 'Return' | 'Details') => {
                    setActiveView(id)
                    if (type === 'Approve') {
                              setOpenRowApproveDialog(true)
                    } else if (type === 'Reject') {
                              setOpenRowRejectDialog(true)
                    } else if (type === 'Return') {
                              setOpenRowReturnDialog(true)
                    } else if (type === 'Details') {
                              setOpenRowDetailsDialog(true)
                    }
          }

          return (
                    <Table>
                              <TableBody>
                                        {stat.data.length ? (
                                                  stat.data.map((request) => (
                                                            <TableRow key={request._id}>
                                                                      <TableCell>
                                                                                <div>
                                                                                          <p className='font-semibold relative'>
                                                                                                    {request.requestor?.firstName} {request.requestor?.lastName}
                                                                                          </p>
                                                                                          <p className='text-xs text-gray-400'>
                                                                                                    {request.requestor?.email}
                                                                                          </p>
                                                                                </div>

                                                                      </TableCell>
                                                                      <TableCell >
                                                                                <div >
                                                                                          <p className='font-semibold text-gray-500'>{request.eventName} - {request.eventLocation}</p>
                                                                                          <p className='text-xs text-gray-400'>
                                                                                                    {formatDate(request.startDate)} - {formatDate(request.endDate)}
                                                                                          </p>

                                                                                </div>
                                                                      </TableCell>
                                                                      <TableCell className='text-sm text-gray-500'>
                                                                      </TableCell>
                                                                      <TableCell className='font-semibold'>
                                                                                {request.vehicle?.licensePlate}
                                                                      </TableCell>
                                                                      <TableCell className='inline-flex gap-2 relative'>
                                                                                {/* <p className='whitespace-nowrap overflow-hidden text-ellipsis text-[10px] absolute font-normal text-gray-400 -bottom-3.5 right-0 bg-white rounded px-1'> {request.createdAt && formatDate(request.createdAt)}</p> */}

                                                                                {
                                                                                          request.status === STATUS.pending &&
                                                                                          (
                                                                                                    <>
                                                                                                              {(activeView === request._id && openRowApproveDialog) &&
                                                                                                                        <ApproveRequestDialog open={openRowApproveDialog} setOpen={setOpenRowApproveDialog} request={request} isUpdated={() => dispatch({ type: 'IS_UPDATED' })} />}
                                                                                                              {(activeView === request._id && openRowRejectDialog) &&
                                                                                                                        <RejectRequestDialog open={openRowRejectDialog} setOpen={setOpenRowRejectDialog} request={request} isUpdated={() => dispatch({ type: 'IS_UPDATED' })} />}
                                                                                                              <Button
                                                                                                                        onClick={() => handleActionClick(request._id, 'Approve')}
                                                                                                                        className='text-xs' size={'sm'}>Approve
                                                                                                              </Button>
                                                                                                              <Button variant='destructive' onClick={() => handleActionClick(request._id, 'Reject')} className='text-xs' size={'sm'}>Reject</Button>
                                                                                                    </>
                                                                                          )
                                                                                }
                                                                                {
                                                                                          request.status === STATUS.approved &&
                                                                                          <>
                                                                                                    {(activeView === request._id && openRowReturnDialog) && <ReturnRequestDialog open={openRowReturnDialog} setOpen={setOpenRowReturnDialog} request={request} isUpdated={() => dispatch({ type: 'IS_UPDATED' })} />}
                                                                                                    <Button className='text-xs' onClick={() => handleActionClick(request._id, 'Return')} size={'sm'}>Return</Button>
                                                                                          </>
                                                                                }
                                                                                {
                                                                                          request.status === 'Completed' &&
                                                                                          <>
                                                                                                    {(activeView === request._id && openRowDetailsDialog) && <RequestViewDetailsDialog open={openRowDetailsDialog} setOpen={setOpenRowDetailsDialog} request={request} />}
                                                                                                    <Button className='text-xs' onClick={() => handleActionClick(request._id, 'Details')} variant='ghost' size={'sm'}><Ellipsis /></Button>
                                                                                          </>
                                                                                }
                                                                      </TableCell>
                                                            </TableRow>
                                                  ))
                                        ) : (
                                                  <TableRow>
                                                            <TableCell colSpan={5} className='text-center'>
                                                                      There's nothing in here
                                                            </TableCell>
                                                  </TableRow>
                                        )}
                              </TableBody>
                              <TableFooter className='bg-transparent text-end text-xs'>
                                        <TableRow>
                                                  <TableCell colSpan={5}>{stat.data.length} {stat.type}</TableCell>
                                        </TableRow>
                              </TableFooter>
                    </Table>
          )
}
