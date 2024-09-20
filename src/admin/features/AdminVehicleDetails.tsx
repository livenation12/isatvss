import { Vehicle } from "@/interfaces"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import useFetch from "@/hooks/useFetch"
import { ArrowLeft, Pencil, Save, Trash } from "lucide-react"
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import VehicleCarousel from "@/components/VehicleCarousel"
import { SubmitHandler } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useVehicle } from "../hooks/useVehicle"
import { useToast } from "@/components/ui/use-toast"


export default function AdminVehicleDetails() {
          const { toast } = useToast()
          const navigate = useNavigate()
          const { state, dispatch } = useVehicle()
          const { vehicleId } = useParams()
          const [vehicleDetails, setVehicleDetails] = useState<Vehicle>()
          const { register, handleSubmit, formState: { isDirty, errors, isSubmitting }, reset, setError } = useForm<Vehicle>({ defaultValues: {} });
          useEffect(() => {
                    const fetchVehicleDetails = async () => {
                              const response = await useFetch(`/vehicles/${vehicleId}`, {})
                              setVehicleDetails(response.data)
                    }
                    fetchVehicleDetails()
          }, [state.isUpdated])
          useEffect(() => {
                    if (vehicleDetails) {
                              reset(vehicleDetails); // Update form values with fetched data
                    }
          }, [vehicleDetails, reset]);

          const handleDeleteVehicle = async () => {
                    try {
                              const response = await useFetch(`/vehicles/${vehicleId}`, { method: 'DELETE' })
                              if (response.success) {
                                        navigate('/admin/vehicles')
                                        toast({ title: "Deleted", description: "Vehicle deleted successfully" })
                              }
                    } catch (error) {
                              console.log(error);
                    }
          }
          const onSubmitUpdate: SubmitHandler<Vehicle> = async (data) => {
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
                    const response = await useFetch(`/vehicles/${vehicleId}`, { body: formData, method: 'PUT' });
                    if (response.success) {
                              dispatch({ type: "IS_UPDATED" });
                              reset();
                              toast({ title: "Updated", description: "Vehicle updated successfully" })
                    } else {
                              setError(response.field, { type: "custom", message: response.message });
                    }
          };

          return (
                    <div className="container">
                              <Link to='/admin/vehicles' className="flex gap-2 font-semibold"><ArrowLeft />  Back to list</Link>
                              <div className="container">
                                        <h1 className="text-3xl inline-flex items-center gap-x-5 font-bold my-2">
                                                  Vehicle Details
                                        </h1>

                                        <div className="fl`ex flex-col-reverse items-start lg:grid lg:grid-cols-2 gap-5">
                                                  <div className="flex flex-col my-5 items-center h-full duration-500">
                                                            <div className="mt-5">
                                                                      <p className="font-semibold text-2xl flex items-center gap-x-2">Model:  <span className="text-xl font-normal">{vehicleDetails?.model}</span></p>
                                                                      <p className="font-semibold text-2xl flex items-center gap-x-2">License Plate:  <span className="text-xl font-normal">{vehicleDetails?.licensePlate}</span></p>
                                                                      <p className="font-semibold text-2xl flex items-center gap-x-2">Max Capacity:  <span className="text-xl font-normal">{vehicleDetails?.maxCapacity}</span></p>
                                                                      <p className="font-semibold text-2xl flex items-center gap-x-2">Model:  <span className="text-xl font-normal">{vehicleDetails?.model}</span></p>
                                                                      <div className="flex gap-2 my-10">

                                                                                <Dialog>
                                                                                          <DialogTrigger asChild>
                                                                                                    <Button variant='outline' className="inline-flex gap-1.5"><Pencil /> Update</Button>
                                                                                          </DialogTrigger>
                                                                                          <DialogContent>
                                                                                                    <DialogHeader>
                                                                                                              <DialogTitle>Update vehicle</DialogTitle>
                                                                                                              <DialogDescription>
                                                                                                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam sint eius sit accusantium ex excepturi tenetur? Temporibus, quos? Cupiditate sed nam perspiciatis quos facilis dignissimos recusandae ad ex modi quibusdam?
                                                                                                              </DialogDescription>
                                                                                                    </DialogHeader>
                                                                                                    <form onSubmit={handleSubmit(onSubmitUpdate)} className="space-y-2">
                                                                                                              <div>
                                                                                                                        <Label className="font-semibold">Add vehicle images</Label>
                                                                                                                        <Input type="file" multiple {...register("images")} />
                                                                                                                        <p className="text-red-500 ms-2 text-xs">{errors.images?.message}</p>
                                                                                                              </div>
                                                                                                              <div>
                                                                                                                        <Label className="font-semibold" htmlFor="model">Model</Label>
                                                                                                                        <Input id="model" {...register("model", { required: "Model is required." })} />
                                                                                                                        <p className="text-red-500 ms-2 text-xs">{errors.model?.message}</p>

                                                                                                              </div>
                                                                                                              <div>
                                                                                                                        <Label className="font-semibold" htmlFor="licensePlate">License Plate</Label>
                                                                                                                        <Input id="licensePlate" {...register("licensePlate", { required: "License plate is required." })} />
                                                                                                                        <p className="text-red-500 ms-2 text-xs">{errors.licensePlate?.message}</p>

                                                                                                              </div>
                                                                                                              <div>
                                                                                                                        <Label className="font-semibold" htmlFor="maxCapacity">Max Capacity</Label>
                                                                                                                        <Input id="maxCapacity" {...register("maxCapacity", { required: "Max capacity is required." })} />
                                                                                                                        <p className="text-red-500 ms-2 text-xs">{errors.maxCapacity?.message}</p>
                                                                                                              </div>
                                                                                                              <div>
                                                                                                                        <Label className="font-semibold" htmlFor="year">Year</Label>
                                                                                                                        <Input id="year" {...register("year", { required: "Year is required." })} />
                                                                                                                        <p className="text-red-500 ms-2 text-xs">{errors.year?.message}</p>
                                                                                                              </div>
                                                                                                              <div>
                                                                                                                        <Label className="font-semibold" htmlFor="color">Color</Label>
                                                                                                                        <Input id="color" {...register("color", { required: "Color is required." })} />
                                                                                                                        <p className="text-red-500 ms-2 text-xs">{errors.color?.message}</p>
                                                                                                              </div>
                                                                                                              <DialogFooter>
                                                                                                                        <Button type="submit" isLoading={isSubmitting} disabled={!isDirty} className="gap-1.5"><Save size={18} /> Save</Button>
                                                                                                              </DialogFooter>
                                                                                                    </form>
                                                                                          </DialogContent>
                                                                                </Dialog>
                                                                                <Dialog>
                                                                                          <DialogTrigger asChild>
                                                                                                    <Button variant='destructive' className="inline-flex gap-1.5"><Trash size={18} /> Delete</Button>
                                                                                          </DialogTrigger>
                                                                                          <DialogContent className="bg-red-200">
                                                                                                    <DialogHeader>
                                                                                                              <DialogTitle>
                                                                                                                        Delete confirmation
                                                                                                              </DialogTitle>
                                                                                                    </DialogHeader>
                                                                                                    <p>Are you sure to delete this vehicle?</p>
                                                                                                    <DialogFooter>
                                                                                                              <DialogClose asChild>
                                                                                                                        <Button variant='ghost'>Cancel</Button>
                                                                                                              </DialogClose>
                                                                                                              <Button variant='destructive' onClick={handleDeleteVehicle}>Delete</Button>
                                                                                                    </DialogFooter>
                                                                                          </DialogContent>
                                                                                </Dialog>
                                                                      </div>
                                                            </div>
                                                  </div>
                                                  <VehicleCarousel vehicle={vehicleDetails} />
                                        </div>
                              </div>
                    </div >
          )
}
