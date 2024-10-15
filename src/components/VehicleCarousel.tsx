import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Vehicle } from "@/interfaces"
// import { Button } from "./ui/button"
// import { Trash } from "lucide-react"
// import useFetch from "@/hooks/useFetch"
// import { useToast } from "./ui/use-toast"
import Nocar from '@/assets/notfound.png'
export default function VehicleCarousel({ vehicle }: { vehicle: Vehicle | undefined }) {
          // const { toast } = useToast()
          // const removeImage = async (image: string) => {
          //           try {
          //                     const response = await useFetch(`/vehicles/remove-image/${vehicle?._id}`, { method: 'PATCH', body: { imageName: image } })
          //                     if (response.success) {
          //                               toast({ description: 'Image removed successfully', title: 'Image removed!', })
          //                     }
          //           } catch (error) {
          //                     console.log(error);

          //           }
          // }
          return (
                    <Carousel className="animate-fadeInRight duration-500">
                              <CarouselContent>
                                        {vehicle && vehicle.images?.length > 0 ? vehicle?.images?.map((image, index) => (
                                                  <CarouselItem key={index}>
                                                            <div className="flex justify-center items-center relative">
                                                                      {/* <Button onClick={() => removeImage(image)} size='sm' className="absolute top-2 left-0 text-xs" variant='destructive'><Trash size={15} className="me-1.5" /> Remove image</Button> */}
                                                                      <img src={`${import.meta.env.VITE_UPLOAD_URL}/vehicles/${image}`} className="max-h-[280px] object-cover w-[80%]" alt={image} />

                                                            </div>
                                                  </CarouselItem>
                                        )) :
                                                  <CarouselItem>
                                                            <figure className="flex flex-col justify-center items-center">
                                                                      <img src={Nocar} className="max-h-[280px] object-cover w-[80%]" alt="No car" />
                                                                      <figcaption className="text-2xl font-semibold">No vehicle images available</figcaption>
                                                            </figure>
                                                  </CarouselItem>
                                        }
                              </CarouselContent>
                              <CarouselNext />
                              <CarouselPrevious />
                    </Carousel>
          )
}
