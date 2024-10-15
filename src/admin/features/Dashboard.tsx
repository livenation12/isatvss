import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ActivitiesTable from "../components/ActivitiesTable"
import { useEffect, useState } from "react"
import useFetch from "@/hooks/useFetch"
import RequestsByMonthChart from "../components/RequestsByMonthChart"
import VehicleUsageChart from "../components/VehicleUsageChart"
interface Counts {
  users: number
  vehicles: number
  requests: {
    total: number
    approved: number
    completed: number
    rejected: number
  }
}
export default function Dashboard() {
  const [counts, setCounts] = useState<Counts>()
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await useFetch('/general', {})
        if (response) {
          setCounts(response.data)
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchCounts()
  }, [])


  return (
    <div className="animate-fadeIn duration-500">
      <div className="grid md:grid-cols-4 gap-1.5 my-1.5">
        <div className="md:col-span-3 space-y-1.5">
          <div className="grid grid-cols-3 gap-1.5">
            <Card>
              <CardHeader>
                <CardTitle>Requests</CardTitle>
              </CardHeader>
              <CardContent className="text-xl font-semibold flex justify-end gap-1.5">
                {counts?.requests?.total}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Vehicles</CardTitle>
              </CardHeader>
              <CardContent className="text-xl font-semibold flex justify-end gap-1.5">{counts?.vehicles}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
              </CardHeader>
              <CardContent className="text-xl font-semibold flex justify-end gap-1.5">{counts?.users}</CardContent>
            </Card>
          </div>
          <div className="grid lg:grid-cols-5 gap-1.5">
            <div className="lg:col-span-3">
              <RequestsByMonthChart />
            </div>
            <div className="lg:col-span-2">
              <VehicleUsageChart />
            </div>
          </div>

        </div>
        <div className="">
          <ActivitiesTable />
        </div>
      </div>
    </div>
  )
}
