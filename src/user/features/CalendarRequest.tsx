import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/useFetch';
import { Vehicle } from '@/interfaces';
import { ArrowLeft, ArrowRight, CircleAlert } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
import CarSelect from '@/assets/notfound.png';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Schedule } from '@/interfaces';
type DateRange = [Date | null, Date | null];

const CalendarForm: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>()
  const [step, setStep] = useState<number>(1); // Current step
  const [selectedDates, setSelectedDates] = useState<DateRange>([null, null]); // Dates selected in step 1
  const [animationDirection, setAnimationDirection] = useState<'next' | 'previous'>('next'); // Animation direction
  const [isAnimating, setIsAnimating] = useState<boolean>(false); // Animation state
  const [isVehicleAvailable, setIsVehicleAvailable] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  // Adjust the type to match `react-calendar`'s expected type
  const handleDateChange: any = useCallback(
    (value: DateRange) => {
      // Ensure value is an array (for range selection)
      if (Array.isArray(value)) {
        setSelectedDates(value);
      } else {
        // Handle the case where value is not an array (could be a single date or null)
        setSelectedDates([null, null]); // Reset the selected dates
      }
    },
    [selectedDates]
  );
  const handleNextStep = () => {
    if (!selectedDates[0] || !selectedDates[1]) {
      toast({
        title: 'Ooops!',
        description: 'Please select a range of dates before proceeding.',
      })
      return;
    }
    setAnimationDirection('next'); // Set direction for next step
    triggerAnimation(() => setStep(step + 1));
  };

  const handlePreviousStep = () => {
    setAnimationDirection('previous'); // Set direction for previous step
    triggerAnimation(() => setStep(step - 1));
  };

  const triggerAnimation = (callback: () => void) => {
    setIsAnimating(true);
    setTimeout(() => {
      callback();
      setIsAnimating(false);
    }, 500); // Duration should match the animation duration
  };
  const handleSubmitRequest = async () => {
    setIsLoading(true)
    try {
      const response = await useFetch('/requests', {
        method: 'POST',
        body: {
          requestor: state?.user?.id,
          startDate: selectedDates[0]?.toISOString(),
          endDate: selectedDates[1]?.toISOString(),
          vehicle: selectedVehicle?._id
        }
      })
      if (response.success) {
        console.log(response);


        setStep(1)
        setSelectedVehicle(null)
        setSelectedDates([null, null])
        toast({
          title: 'Success!',
          description: 'Your request has been submitted successfully. Please wait for a response from our team.',
        })
        navigate('/requests')
      } else if (!response.success) {
        console.log(response);

        toast({
          title: 'Ooops!',
          description: response.message || 'Something went wrong'
        })
      }

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      const response = await useFetch('/vehicles', {});
      setVehicles(response.data);
    };
    fetchVehicles();
  }, []);

  const hasVehicleScheduleConflict = (schedules: Schedule[], selectedRange: DateRange): boolean => {
    const [selectedStart, selectedEnd] = selectedRange;

    if (!selectedStart || !selectedEnd) {
      return false; // No conflict if either of the selected dates is null
    }

    // Iterate over each schedule and check if there's an overlap
    return schedules.some(schedule => {
      const startDate = new Date(schedule.startDate);
      const endDate = new Date(schedule.endDate);
      // Check if the selected range overlaps with any schedule range
      return (
        (selectedStart <= endDate && selectedEnd >= startDate) // Conflict occurs if ranges overlap
      );
    });
  };

  const handleSelectedVehicle = (vehicle: Vehicle) => {
    if (hasVehicleScheduleConflict(vehicle.schedules, selectedDates)) {
      setIsVehicleAvailable(false)
    } else {
      setIsVehicleAvailable(true)
    }
    setSelectedVehicle(vehicle);
  }


  const renderStepContent = () => {
    let animationClasses = '';

    if (isAnimating) {
      animationClasses =
        animationDirection === 'next'
          ? 'transform -translate-x-full opacity-0'
          : 'transform translate-x-full opacity-0';
    } else {
      animationClasses = 'transform translate-x-0 opacity-100';
    }

    switch (step) {
      case 1:
        return (
          <div
            className={`grid md:grid-cols-2 gap-y-5 gap-x-10 transition-all duration-500 ease-in-out ${animationClasses}`}
          >
            <div className='space-y-2 mt-10'>
              <h1 className='text-5xl font-semibold'>Schedule your request via our calendar.</h1>
              <p className='text-3xl font-bold'>Step 1:     </p>
              <ul className='ms-12'>
                <li>Determine range of days of the event and click (two if more than 1) the calendar's date you want.</li>
                <li>After select click <strong>next</strong></li>
              </ul>
            </div>
            <div className=''>
              <div className="text-lg font-bold flex justify-between items-center">
                <span>
                  Select dates
                </span>

              </div>
              <Calendar
                next2Label={null}
                prev2Label={null}
                nextLabel={<ArrowRight className='inline-flex justify-center ms-5' size={18} />}
                prevLabel={<ArrowLeft className='inline-flex justify-center me-5' size={18} />}
                className="w-full modern-calendar"
                selectRange={true} // Enable range selection
                onChange={handleDateChange} // Handle selected dates
                value={selectedDates} // Current selected dates
                tileContent={({ date, view }) => {
                  if (view === 'month' && selectedDates) {
                    const [start, end] = selectedDates;

                    if (date.toDateString() === start?.toDateString()) {
                      return (
                        <div className='relative text-xs'>
                          start
                        </div>
                      )
                    }
                    if (date.toDateString() === end?.toDateString()) {
                      return (
                        <div className='relative text-xs'>
                          end
                        </div>
                      )
                    }
                  }
                  return null;
                }}
              />
              <Button className="my-2 float-right" onClick={handleNextStep}>
                Next <ArrowRight size={15} className='ms-2' />
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <>
            <div
              className={`transition-all duration-500 ease-in-out relative ${animationClasses}`}
            >
              <div className='flex justify-between'>
                <div>
                  <h2 className='text-4xl font-bold'>Step 2: <span className='text-3xl font-semibold '>Choose your vehicle</span></h2>
                  <p className='ms-5 mt-2'>Choose the appropriate available vehicle for the campus on the left</p>
                  <p className='ms-5'>See the vehicle details on the right, then <strong>submit</strong></p>
                </div>
                <div>
                  <div className='bg-yellow-500 p-3 text-sm text-gray-100 rounded-lg'>
                    <h4 className='font-semibold'>Your event date</h4>
                    <p>{selectedDates[0]?.toLocaleDateString() || 'No date selected'} to {selectedDates[1]?.toLocaleDateString() || 'No date selected'}</p>

                  </div>
                </div>
              </div>
              <div className='grid lg:grid-cols-3 gap-4'>
                <div className=''>
                  <p className='px-5 py-2 pb-1'>{vehicles.length} Vehicles</p>
                  <ul className='space-y-4 flex lg:flex-col'>
                    {vehicles.map((vehicle) => {
                      const hasConflict = hasVehicleScheduleConflict(vehicle.schedules, selectedDates); // Check if vehicle has a conflict
                      return (
                        <li
                          key={vehicle._id}
                          className={`rounded-lg border shadow-lg relative group ${hasConflict ? 'border-2 border-red-500' : ''}`}
                          onClick={() => handleSelectedVehicle(vehicle)}
                        >
                          {hasConflict && <span className='absolute rounded-s-lg right-0 top-5 bg-red-500 text-white text-xs px-3 py-2'>Unavailable</span>}
                          <p className={`absolute hidden group-hover:block bg-white rounded-full py-1 px-2 text-xs text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg cursor-pointer`}>
                            {hasConflict ? 'Schedule Conflict' : 'Click to see full details'}
                          </p>
                          <img
                            src={`${import.meta.env.VITE_UPLOAD_URL}/vehicles/${vehicle.images[0]}`}
                            className='rounded object-cover w-full min-h-max h-[250px]'
                            alt={vehicle.model}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className='col-span-2'>
                  <div className='p-5 rounded-xl border min-h-[500px] border-gray-300 sticky top-20 shadow-xl'>
                    <div className='flex justify-end mb-1'>

                      {
                        selectedVehicle &&
                        <Button size='sm' variant='outline' onClick={() => setSelectedVehicle(null)}>Unselect</Button>
                      }
                    </div>
                    {selectedVehicle ? (
                      <>
                        <div className='max-w-full flex justify-center overflow-x-auto gap-1'>
                          {selectedVehicle.images.map((image, index) => (
                            <img key={index} src={`${import.meta.env.VITE_UPLOAD_URL}/vehicles/${image}`} className='object-cover h-52 rounded' alt={selectedVehicle.model} />
                          ))}
                        </div>
                        <div className='m-14'>
                          <p className='text-3xl font-semibold'>{selectedVehicle.model}  <sup className='text-base'>({selectedVehicle.year})</sup></p>
                          <p className='ms-2'>{selectedVehicle.color}</p>
                          <p className='ms-2'>{selectedVehicle.licensePlate}</p>
                          {!isVehicleAvailable && <p className='float-end text-sm text-red-500'><CircleAlert size={18} className='inline' /> This vehicle is unavailable on your selected date</p>}
                        </div>
                        <div className='absolute bottom-3 right-3'>
                          <Button variant={'ghost'} className="mr-2" onClick={handlePreviousStep}>Back to calendar</Button>
                          {isVehicleAvailable ?
                            <Button onClick={handleNextStep}>Next</Button>
                            :
                            <Button variant='destructive' disabled>Unavailable</Button>
                          }
                        </div>
                      </>
                    )
                      :
                      <>
                        <Button variant={'ghost'} className="float-right underline" onClick={handlePreviousStep}>Back to calendar</Button>
                        <h2 className='text-3xl font-semibold inline-flex items-center gap-x-3'><ArrowLeft /> Select a vehicle</h2>
                        <p className='ms-10 text-xl'>See full details here</p>
                        <div className='flex justify-center'>
                          <img className='object-cover self-center mt-10' width={500} src={CarSelect} alt='Car Select' />
                        </div>
                      </>
                    }
                  </div>
                </div>
              </div>
            </div >
          </>
        );
      case 3:
        return (
          <div
            className={`transition-all flex flex-col lg:items-start items-center lg:flex-row gap-x-10 duration-500 ease-in-out ${animationClasses}`}
          >
            <div className='lg:w-3/5 w-full'>
              <div className='my-5'>
                <p>
                  <span className='text-xl font-semibold'>Date: </span>
                  <span className='mr-1'>{selectedDates[0]?.toLocaleDateString()}</span> to
                  <span className='ms-1'>{selectedDates[1]?.toLocaleDateString()}</span>
                </p>

              </div>
              <div>
                <h3 className='text-xl font-semibold'>Vehicle</h3>
                <div className='max-w-full flex justify-center overflow-x-auto gap-1'>
                  {selectedVehicle?.images.map((image, index) => (
                    <img key={index} src={`${import.meta.env.VITE_UPLOAD_URL}/vehicles/${image}`} className='object-cover h-52 rounded' alt={selectedVehicle.model} />
                  ))}
                </div>
                <div className='my-2 mx-5'>
                  <p className='text-3xl font-semibold'>{selectedVehicle?.model}  <sup className='text-base'>({selectedVehicle?.year})</sup></p>
                  <p className=''>{selectedVehicle?.color}</p>
                  <p className='ms-2'>{selectedVehicle?.licensePlate}</p>
                </div>

              </div>
            </div>
            <div className='lg:w-2/5 h-full flex flex-col justify-between items-center space-y-10 py-16'>
              <div>
                <p className='text-3xl font-bold'>Step 3: Request confirmation</p>
                <ul className='ms-12'>
                  <li>Review the requested dates and vehicles.</li>
                  <li>Confirm your request and click <strong>Submit Request</strong>.</li>
                </ul>
              </div>
              <div className='self-end space-x-3'>
                <Button variant='ghost' onClick={handlePreviousStep}>Back</Button>
                <Button isLoading={isLoading} onClick={handleSubmitRequest}>Submit Request</Button>
              </div>
            </div>

          </div>
        )
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 flex justify-center">
      {renderStepContent()}
    </div>
  );
};

export default CalendarForm;
