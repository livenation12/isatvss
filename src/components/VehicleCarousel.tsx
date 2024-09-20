import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Vehicle } from "@/interfaces"

export default function VehicleCarousel({ vehicle }: { vehicle: Vehicle | undefined }) {
          return (
                    <Carousel className="animate-fadeInRight duration-500">
                              <CarouselContent>
                                        {vehicle?.images?.map((image, index) => (
                                                  <CarouselItem key={index}>
                                                            <div className="flex justify-center items-center">

                                                                      <img src={`${import.meta.env.VITE_UPLOAD_URL}/vehicles/${image}`} className="max-h-[280px] object-cover w-[80%]" alt={image} />

                                                            </div>
                                                  </CarouselItem>
                                        ))}
                              </CarouselContent>
                              <CarouselNext />
                              <CarouselPrevious />
                    </Carousel>
          )
}
