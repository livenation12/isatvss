import { useEffect, useState } from 'react';
import { Requests } from '@/interfaces/requests.interface';
import useFetch from '@/hooks/useFetch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRequest } from '../hooks/useRequest';
import TableRequest from '../components/TableRequest';
import ScheduleCalendar from '../components/ScheduleCalendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoaderCircle } from 'lucide-react';

interface StatusRequest {
          pending: Requests[];
          approved: Requests[];
          rejected: Requests[];
          completed: Requests[];
}
export const STATUS = {
          pending: 'Pending',
          approved: 'Approved',
          rejected: 'Rejected',
          completed: 'Completed',
};

export default function AdminRequests() {
          const [isFetching, setIsFetching] = useState(false);
          const { state, dispatch } = useRequest();
          const initialRequestState: StatusRequest = {
                    pending: [],
                    approved: [],
                    rejected: [],
                    completed: []
          };
          const [requests, setRequests] = useState<StatusRequest>(initialRequestState);
          const status = [
                    { type: 'pending', data: requests.pending },
                    { type: 'approved', data: requests.approved },
                    { type: 'rejected', data: requests.rejected },
                    { type: 'completed', data: requests.completed },
          ];
          useEffect(() => {
                    const fetchRequest = async () => {
                              setIsFetching(true);
                              try {
                                        const response = await useFetch('/requests', {});
                                        if (response && response.data) {
                                                  const categorizedItems: StatusRequest = {
                                                            pending: [],
                                                            approved: [],
                                                            rejected: [],
                                                            completed: [],

                                                  };

                                                  response.data.forEach((item: Requests) => {
                                                            if (item.status === STATUS.pending) {
                                                                      categorizedItems.pending.push(item);
                                                            } else if (item.status === STATUS.approved) {
                                                                      categorizedItems.approved.push(item);
                                                            } else if (item.status === STATUS.rejected) {
                                                                      categorizedItems.rejected.push(item);
                                                            } else if (item.status === STATUS.completed) {
                                                                      categorizedItems.completed.push(item);
                                                            }
                                                  });

                                                  setRequests(categorizedItems);
                                        }
                              } catch (error) {
                                        console.error(error);
                              } finally {
                                        setIsFetching(false);
                              }
                    };
                    fetchRequest();
          }, [state.isUpdated]);


          return (
                    <div className="container animate-fadeIn duration-500">
                              <div className='grid lg:grid-cols-3 gap-2'>
                                        <div className='lg:col-span-2'>
                                                  <Card className='min-h-[350px]'>
                                                            <CardHeader>
                                                                      <CardTitle>Requests</CardTitle>
                                                            </CardHeader>
                                                            <CardContent>
                                                                      {isFetching ? (
                                                                                <LoaderCircle className="h-10 w-10 animate-spin" />
                                                                      ) : (
                                                                                <Tabs defaultValue="pending" className="flex flex-col items-center">
                                                                                          <TabsList className="py-5 shadow-inner flex w-full">
                                                                                                    {status.map((stat, index) => (
                                                                                                              <TabsTrigger className="capitalize w-full" onClick={() => dispatch({ type: 'VIEW_DETAILS', payload: null })} value={stat.type} key={index}>
                                                                                                                        {stat.type}
                                                                                                              </TabsTrigger>
                                                                                                    ))}
                                                                                          </TabsList>

                                                                                          {status.map((stat, index) => (
                                                                                                    <TabsContent className="w-full" value={stat.type} key={index}>
                                                                                                              <TableRequest stat={stat} />
                                                                                                    </TabsContent>
                                                                                          ))}
                                                                                </Tabs>
                                                                      )}

                                                            </CardContent>
                                                  </Card>

                                        </div>
                                        <div>
                                                  {isFetching ? (<LoaderCircle className="h-10 w-10 animate-spin" />) : <ScheduleCalendar />}
                                        </div>


                              </div>

                    </div>
          );
}
