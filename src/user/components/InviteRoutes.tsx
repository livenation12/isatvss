import useFetch from '@/hooks/useFetch'
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function InviteRoutes({ children }: { children: React.ReactNode }) {
          const location = useLocation()
          const [isLoading, setIsLoading] = useState(false)
          const [hasToken, setHasToken] = useState(true)
          const [errorMessage, setErrorMessage] = useState('')
          const queryParams = new URLSearchParams(location.search);
          const token = queryParams.get('token')
          useEffect(() => {
                    const verifyAuth = async () => {
                              setIsLoading(true)
                              try {
                                        const response = await useFetch('/auth/verify-invite', { body: { token }, method: 'POST' })
                                        if (response.success) {
                                                  setHasToken(true)
                                        } else {
                                                  setHasToken(false)
                                                  setErrorMessage(response.error)
                                        }
                              } catch (error) {
                                        console.log(error);
                                        setHasToken(false)
                              } finally {
                                        setIsLoading(false)
                              }
                    }
                    verifyAuth()
          }, [])
          if (isLoading) {
                    return <div>Loading...</div>
          }
          if (!hasToken) {
                    return (
                              <div className='flex justify-center min-h-max h-screen'>
                                        <div className='mt-20 space-y-3'>
                                                  <h2 className='text-5xl my-2 font-semibold'>Vehicle Scheduling System</h2>
                                                  <h3 className="text-3xl font-semibold text-red-500">Ooopss! {errorMessage}</h3>
                                                  <p>Go back to <Link className='text-blue-500 underline' to="/">home</Link></p>
                                        </div>

                              </div>
                    )
          }
          return <div>{children}</div>
}
