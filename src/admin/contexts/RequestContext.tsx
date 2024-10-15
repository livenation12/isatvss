import React, { createContext, useReducer } from "react"
import { Requests } from "@/interfaces"
interface RequestState {
          isUpdated: boolean,
          requestDetails: Requests | null

}

type RequestActions =
          { type: "IS_UPDATED" } |
          { type: "VIEW_DETAILS", payload: Requests | null }

export interface RequestContextType {
          state: RequestState
          dispatch: React.Dispatch<RequestActions>
}

export const RequestContext = createContext<RequestContextType | undefined>(undefined)

const requestReducer = (state: RequestState, action: RequestActions) => {
          switch (action.type) {
                    case "IS_UPDATED":
                              return { ...state, isUpdated: !state.isUpdated }
                    case "VIEW_DETAILS":
                              return { ...state, requestDetails: action.payload }
                    default:
                              return state
          }
}

export const RequestProvider = ({ children }: { children: React.ReactNode }) => {
          const [state, dispatch] = useReducer(requestReducer, {
                    isUpdated: false,
                    requestDetails: null

          })
          return (
                    <RequestContext.Provider value={{ state, dispatch }}>
                              {children}
                    </RequestContext.Provider>
          )
}