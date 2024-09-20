import React, { createContext, useReducer } from "react"

interface RequestState {
          isUpdated: boolean
}

type RequestActions =
          { type: "IS_UPDATED" }

export interface RequestContextType {
          state: RequestState
          dispatch: React.Dispatch<RequestActions>
}

export const RequestContext = createContext<RequestContextType | undefined>(undefined)

const requestReducer = (state: RequestState, action: RequestActions) => {
          switch (action.type) {
                    case "IS_UPDATED":
                              return { ...state, isUpdated: !state.isUpdated }
                    default:
                              return state
          }
}

export const RequestProvider = ({ children }: { children: React.ReactNode }) => {
          const [state, dispatch] = useReducer(requestReducer, {
                    isUpdated: false
          })
          return (
                    <RequestContext.Provider value={{ state, dispatch }}>
                              {children}
                    </RequestContext.Provider>
          )
}