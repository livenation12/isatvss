import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import useFetch from '@/hooks/useFetch'
import { useEffect, useState } from 'react'
interface Activities {
          title: string
          description: string
          from: string
          to: string
          createdAt: string
}
export default function ActivitiesTable() {
          const [activities, setActivities] = useState<Activities[]>([])
          useEffect(() => {
                    const fetchActivities = async () => {
                              try {
                                        const response = await useFetch('/activities', {})
                                        if (response.success) {
                                                  setActivities(response.data)
                                        }
                              } catch (error) {
                                        console.log(error);

                              }
                    }
                    fetchActivities()
          }, [])

          return (
                    <Table className='bg-white rounded'>
                              <TableHeader>
                                        <TableRow>
                                                  <TableHead className='text-lg font-semibold'>Activity logs</TableHead>

                                        </TableRow>
                              </TableHeader>
                              <TableBody>
                                        {activities.length > 0 ? activities.map((activity, index) => (
                                                  <TableRow key={index}>
                                                            <TableCell>
                                                                      <div>
                                                                                <h4 className='font-semibold'>{activity.title}</h4>
                                                                                <p className='ms-2 text-xs text-gray-500'>{activity.description}</p>
                                                                      </div>

                                                            </TableCell>
                                                  </TableRow>
                                        )) :
                                                  <TableRow>
                                                            <TableCell>No activities</TableCell>
                                                  </TableRow>
                                        }
                              </TableBody>
                    </Table>
          )
}
