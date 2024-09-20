import React, { createContext, useReducer } from "react"

interface UserState {
          isUpdated: boolean
}

type UserActions =
          { type: "IS_UPDATED" }

export interface UserContextType {
          state: UserState
          dispatch: React.Dispatch<UserActions>
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

const UserReducer = (state: UserState, action: UserActions) => {
          switch (action.type) {
                    case "IS_UPDATED":
                              return { ...state, isUpdated: !state.isUpdated }
                    default:
                              return state
          }
}

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
          const [state, dispatch] = useReducer(UserReducer, {
                    isUpdated: false
          })
          return (
                    <UserContext.Provider value={{ state, dispatch }}>
                              {children}
                    </UserContext.Provider>
          )
}