import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/useFetch";
import type { Vehicle } from "@/interfaces";

export default function VehicleForm() {
          const { register, handleSubmit, setError, formState: { errors, isSubmitting }, reset } = useForm<Vehicle>();
          const onSubmit: SubmitHandler<Vehicle> = async (data) => {
                    const formData = new FormData();
                    // Convert non-string values to strings before appending
                    Object.keys(data).forEach((key) => {
                              const value = data[key as keyof Vehicle];
                              if (key === "images" && value instanceof FileList) {
                                        // Handle file list separately
                                        Array.from(value).forEach(file => formData.append("images", file));
                              } else if (typeof value === "number") {
                                        // Convert numbers to strings
                                        formData.append(key, String(value));
                              } else if (Array.isArray(value)) {
                                        // Ensure that `value` is an array before calling `forEach`
                                        value.forEach((item: any) => formData.append(key, item));
                              } else {
                                        // Append strings as they are
                                        formData.append(key, value as string);
                              }
                    });

                    // Use the adjusted fetch hook to handle FormData
                    const response = await useFetch("/vehicles", { body: formData, method: 'POST' });

                    if (response.success) {
                              reset();
                    } else {
                              setError(response.field, { type: "custom", message: response.message });
                    }
          };


          return (
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2" encType="multipart/form-data">
                              <Label className="ms-1">Images</Label>
                              <Input type="file" multiple {...register("images", { required: "Images are required." })} />
                              <p className="text-red-500 ms-2 text-xs">{errors.images?.message}</p>

                              <Label className="ms-1">Model</Label>
                              <Input {...register("model", { required: "Model is required." })} />
                              <p className="text-red-500 ms-2 text-xs">{errors.model?.message}</p>

                              <Label className="ms-1">Year</Label>
                              <Input {...register("year", { required: "Year is required." })} />
                              <p className="text-red-500 ms-2 text-xs">{errors.year?.message}</p>

                              <Label className="ms-1">Color</Label>
                              <Input {...register("color", { required: "Color is required." })} />
                              <p className="text-red-500 ms-2 text-xs">{errors.color?.message}</p>

                              <Label className="ms-1">Max Capacity</Label>
                              <Input type="number" {...register("maxCapacity", { required: "Max Capacity is required." })} />
                              <p className="text-red-500 ms-2 text-xs">{errors.maxCapacity?.message}</p>

                              <Label className="ms-1">License Plate</Label>
                              <Input {...register("licensePlate", { required: "License Plate is required." })} />
                              <p className="text-red-500 ms-2 text-xs">{errors.licensePlate?.message}</p>
                              <Button type="submit" isLoading={isSubmitting}>Create</Button>
                    </form>
          );
}
