import {
          Card,
          CardContent,
          CardDescription,
          CardFooter,
          CardHeader,
          CardTitle,
} from "@/components/ui/card";
import useFetch from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import {
          ChartConfig,
          ChartContainer,
          ChartTooltip,
          ChartTooltipContent,
} from "@/components/ui/chart";
import { LoaderCircle } from "lucide-react";

interface ChartData {
          count: number;
          vehicleModel: string;
          vehicleId: string;
          vehicleLicensePlate: string;
}

// Define a set of blackish colors for the pie chart
const COLORS = [
          "#303030", // Dark gray
          "#4B4B4B", // Dim gray
          "#6E6E6E", // Gray
          "#8C8C8C", // Light gray
          "#AFAFAF", // Silver
];

export default function VehicleUsageChart() {
          const [data, setData] = useState<ChartData[]>([]); // Initialize as an empty array

          // Construct the chartConfig object
          const chartConfig: ChartConfig = data.reduce((acc, vehicleData) => {
                    acc[vehicleData.vehicleLicensePlate] = {
                              label: vehicleData.vehicleLicensePlate,
                              color: COLORS[data.indexOf(vehicleData) % COLORS.length], // Use defined colors
                    };
                    return acc;
          }, {} as Record<string, { label: string; color: string }>); // Ensure the type matches ChartConfig

          useEffect(() => {
                    const fetchData = async () => {
                              try {
                                        const response = await useFetch("/requests/vehicle-usage", {});
                                        if (response.success) {
                                                  setData(response.data);
                                        }
                              } catch (error) {
                                        console.log(error);
                              }
                    };
                    fetchData();
          }, []);

          if (!data.length) {
                    return <LoaderCircle className="h-4 w-4 animate-spin" />; // Show a loading state
          }

          const averageUsage = data.reduce((total, vehicle) => total + vehicle.count, 0) / data.length;

          return (
                    <Card className="flex flex-col">
                              <CardHeader>
                                        <CardTitle>Vehicle Usage Chart</CardTitle>
                                        <CardDescription>Usage distribution by vehicle</CardDescription>
                              </CardHeader>
                              <CardContent className="flex-1 pb-0">
                                        <ChartContainer config={chartConfig} className="mx-auto">
                                                  <PieChart>
                                                            <ChartTooltip
                                                                      cursor={false}
                                                                      content={<ChartTooltipContent hideLabel />}
                                                            />
                                                            <Pie
                                                                      data={data}
                                                                      dataKey="count"
                                                                      nameKey="vehicleModel"
                                                                      cx="50%"
                                                                      cy="50%"
                                                                      innerRadius={45}
                                                                      fill="#8884d8"
                                                            >
                                                                      {data.map((_, index) => (
                                                                                <Cell key={`cell-${index}`} fill={chartConfig[data[index].vehicleLicensePlate].color} />
                                                                      ))}
                                                            </Pie>
                                                  </PieChart>
                                        </ChartContainer>
                              </CardContent>
                              <CardFooter className="flex flex-col items-start gap-2 text-sm">
                                        <p><strong>Average vehicle usage:</strong> {averageUsage.toFixed()}</p>
                              </CardFooter>
                    </Card>
          );
}
