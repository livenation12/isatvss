export type Schedule = {
          _id?: string,
          startDate: Date,
          endDate: Date
}

export interface Vehicle {
          _id: string;
          licensePlate: string;
          model: string;
          year: number;
          color: string;
          maxCapacity: number;
          images: string[];
          schedules: Schedule[];
}
