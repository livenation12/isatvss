import { User } from "./user.interface"
import { Vehicle } from "./vehicle.interfaces"

export type StatusTypes = "Pending" | "Approved" | "Rejected" | "Cancelled" | "Completed";

export interface IEvent {
          eventDescription?: string
          eventName: string
          eventLocation: string
}

export interface Requests extends IEvent {
          _id: string
          requestor: User
          startDate: Date
          endDate: Date
          vehicle: Vehicle
          status?: StatusTypes
          reviewedBy?: string
          message?: string
          createdAt?: Date
          updatedAt?: Date
          deploymentOdometer?: number
          returnedOdometer?: number

}