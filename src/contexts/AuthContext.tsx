import React, { createContext, useReducer, ReactNode } from 'react';

// Define User interface
interface User {
          id: string;
          email: string;
          // Add any other user properties you have
}

// Define Auth State and Action types
interface AuthState {
          user: User | null;
          isLoading: boolean;
}

type AuthAction =
          | { type: 'LOGIN'; payload: User | null }
          | { type: 'SET_LOADING'; payload: boolean }
          | { type: 'LOGOUT' };

// Define Auth Context type
export interface AuthContextType {
          state: AuthState;
          dispatch: React.Dispatch<AuthAction>;
}

// Create Auth Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth reducer function
function authReducer(state: AuthState, action: AuthAction): AuthState {
          switch (action.type) {
                    case 'LOGIN':
                              return { ...state, user: action.payload };
                    case 'LOGOUT':
                              return { ...state, user: null };
                    case 'SET_LOADING':
                              return { ...state, isLoading: action.payload };
                    default:
                              return state;
          }
}

// Define AuthProvider props
interface AuthProviderProps {
          children: ReactNode;
}

// AuthProvider component using useReducer
export const AuthProvider = ({ children }: AuthProviderProps) => {
          const [state, dispatch] = useReducer(authReducer, {
                    user: null,
                    isLoading: true,
          });

          return (
                    <AuthContext.Provider value={{ state, dispatch }}>
                              {children}
                    </AuthContext.Provider>
          );
};
