import React, { createContext, useReducer } from "react"

interface VehicleState {
          isUpdated: boolean
}

type VehicleActions =
          { type: "IS_UPDATED" }

export interface VehicleContextType {
          state: VehicleState
          dispatch: React.Dispatch<VehicleActions>
}

export const VehicleContext = createContext<VehicleContextType | undefined>(undefined)

const vehicleReducer = (state: VehicleState, action: VehicleActions) => {
          switch (action.type) {
                    case "IS_UPDATED":
                              return { ...state, isUpdated: !state.isUpdated }
                    default:
                              return state
          }
}

export const VehicleProvider = ({ children }: { children: React.ReactNode }) => {
          const [state, dispatch] = useReducer(vehicleReducer, {
                    isUpdated: false
          })
          return (
                    <VehicleContext.Provider value={{ state, dispatch }}>
                              {children}
                    </VehicleContext.Provider>
          )
}