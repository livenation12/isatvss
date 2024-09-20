import { User } from "./user.interface"
import { Vehicle } from "./vehicle.interfaces"

export type StatusTypes = "Pending" | "Approved" | "Rejected"
export interface Requests {
          _id: string
          requestor: User
          startDate: string
          endDate: string
          vehicle: Vehicle
          status?: StatusTypes
          reviewedBy?: string
          message?: string
}