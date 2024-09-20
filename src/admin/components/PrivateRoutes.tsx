import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import useFetch from '@/hooks/useFetch';
import { LoaderCircle } from 'lucide-react';

const PrivateRoutes = ({ children }: { children: React.ReactNode }) => {
          const { state, dispatch } = useAuth();
          const { toast } = useToast();
          const location = useLocation();
          console.log(state);

          useEffect(() => {
                    dispatch({ type: 'SET_LOADING', payload: true });
                    const verifyAdmin = async () => {
                              try {
                                        const response = await useFetch('/admin/verify', { method: 'GET', credentials: 'include' });
                                        if (response.admin) {
                                                  dispatch({ type: 'LOGIN', payload: response.admin });
                                        } else {
                                                  dispatch({ type: 'LOGOUT' });
                                                  toast({
                                                            title: 'Unauthorized',
                                                            description: 'Please login as admin to continue',
                                                  });
                                        }
                              } catch (error) {
                                        dispatch({ type: 'LOGOUT' });
                              }
                              finally {
                                        dispatch({ type: 'SET_LOADING', payload: false });
                              }
                    };
                    verifyAdmin();
          }, [dispatch, toast]);

          if (state.isLoading) {
                    return <div className='min-h-max h-screen min-w-max w-screen flex justify-center items-center'>
                              <LoaderCircle className='animate-spin' size={50} />
                    </div>;
          }

          if (!state.user) {
                    return <Navigate to="/admin/gate" state={{ from: location }} replace />;
          }

          return <>{children}</>;
};

export default PrivateRoutes;
