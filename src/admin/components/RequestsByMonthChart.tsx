import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import useFetch from "@/hooks/useFetch";
import { useEffect, useState } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis } from "recharts"; // Added YAxis
import { LoaderCircle } from "lucide-react";

interface IChartData {
  year: number;
  month: number;
  requests: number;
}

const currentYear = new Date().getFullYear();
// const startYear = 2020;

function getMonthName(monthNumber: number) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[monthNumber - 1];
}

export default function RequestsByMonthChart() {
  const year = currentYear;
  const [data, setData] = useState<IChartData[]>([]);
  // const [year, setYear] = useState(currentYear);
  const [isLoading, setIsLoading] = useState(false);
  // const yearsOptions = Array.from({ length: currentYear + 1 - startYear + 1 }, (_, i) => startYear + i);
  const chartConfig = {
    requests: {
      label: "Requests",
      color: "#303030",
    },
  } satisfies ChartConfig;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await useFetch(`/requests/monthly-count/${year}`, {});
        if (response.success) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error); // Improved error logging
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [year]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly requests</CardTitle>
        <CardDescription>
          For the year {year}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1.5">
        <div className="flex justify-end">
          {/* <Select onValueChange={(value) => setYear(parseInt(value))} defaultValue={year.toString()}>
            <SelectTrigger className="w-[180px] h-8">
              <SelectValue placeholder={year.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Years</SelectLabel>
                {yearsOptions.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select> */}
        </div>
        {isLoading ? <LoaderCircle size={50} /> :
          data.length > 0 ?
            <ChartContainer config={chartConfig} className="min-h-max h-[300px] w-full">
              <BarChart data={data}>
                <YAxis
                  dataKey="requests"
                  tickLine={false} // Explicitly set the prop
                  axisLine={false} // Explicitly set the prop
                  tickMargin={10} // Explicitly set the prop
                  width={40} // Explicitly set the prop
                  domain={[0, 'dataMax']} // Custom range
                  tickCount={Math.ceil(Math.max(...data.map(d => d.requests))) + 1}
                  tickFormatter={(value) => Math.floor(value).toString()}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false} // Explicitly set the prop
                  tickMargin={10} // Explicitly set the prop
                  axisLine={false} // Explicitly set the prop
                  tickFormatter={(value) => getMonthName(value)} // Custom formatter
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="requests" fill={chartConfig.requests.color} radius={4} />
              </BarChart>
            </ChartContainer>

            : <div className="min-h-max h-[300px] flex justify-center items-center">No data available</div>
        }
      </CardContent>
    </Card>
  );
}
