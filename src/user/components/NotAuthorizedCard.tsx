import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotAuthorizedCard() {
          return (
                    <div className='flex justify-center items-center flex-col mt-20 space-y-3'>
                              <div className='bg-white shadow flex justify-center items-center gap-x-10 py-10 px-5'>
                                        <AlertCircle size={90} className='text-yellow-500' />
                                        <div>
                                                  <h2 className='text-4xl my-2 font-semibold'>Vehicle Scheduling System</h2>
                                                  <h3 className="text-3xl font-semibold">Ooopss your not logged in yet</h3>
                                                  <Button variant='ghost' className='float-end'><Link className='underline' to="/login">Login</Link></Button>
                                        </div>

                              </div>
                    </div>
          )
}
