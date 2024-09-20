import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '../../hooks/useAuth';
import useFetch from '@/hooks/useFetch';

interface ProtectedRoutesProps {
          children: React.ReactNode;
}

const ProtectedRoutes = ({ children }: ProtectedRoutesProps) => {
          const { state, dispatch } = useAuth();
          const { toast } = useToast();
          const location = useLocation();

          useEffect(() => {
                    const verifyAuth = async () => {
                              dispatch({ type: 'SET_LOADING', payload: true });
                              try {
                                        const response = await useFetch('/auth/verify', {});
                                        if (response) {
                                                  dispatch({ type: 'LOGIN', payload: response.user });
                                        } else {
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
                    return <div>Loading...</div>;
          }

          if (!state.user) {
                    return <Navigate to="/login" state={{ from: location }} replace />;
          }

          return <>{children}</>;
};

export default ProtectedRoutes;
