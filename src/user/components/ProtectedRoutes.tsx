import React, { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '../../hooks/useAuth';
import useFetch from '@/hooks/useFetch';
import { LoaderCircle } from 'lucide-react';
import NotAuthorizedCard from './NotAuthorizedCard';
interface ProtectedRoutesProps {
          children: React.ReactNode;
}

const ProtectedRoutes = ({ children }: ProtectedRoutesProps) => {
          const { state, dispatch } = useAuth();
          const { toast } = useToast();
          useEffect(() => {
                    const verifyAuth = async () => {
                              dispatch({ type: 'SET_LOADING', payload: true });
                              try {
                                        const response = await useFetch('/auth/verify', {});
                                        if (response) {
                                                  dispatch({ type: 'LOGIN', payload: response.user });
                                        } else {
                                                  console.log(response);

                                                  dispatch({ type: 'LOGOUT' });
                                                  toast({
                                                            title: 'Unauthorized',
                                                            description: 'Please login',
                                                  });
                                        }
                              } catch (error) {
                                        dispatch({ type: 'LOGOUT' });
                              } finally {
                                        dispatch({ type: 'SET_LOADING', payload: false });
                              }
                    };

                    verifyAuth();
          }, [dispatch, toast]);

          if (state.isLoading) {
                    return (
                              <div className='min-h-max h-screen min-w-max w-screen flex justify-center items-center'>
                                        <LoaderCircle className='animate-spin' size={50} />
                              </div>
                    )
          }

          if (!state.user) {
                    return (
                              <NotAuthorizedCard />
                    )
          }

          return <>{children}</>;
};

export default ProtectedRoutes;
