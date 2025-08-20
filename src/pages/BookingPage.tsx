import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import SEO from "@/components/Seo";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockApi, Route } from "@/lib/mock-data";
import { 
  CheckCircle, 
  XCircle, 
  Bus, 
  MapPin, 
  Clock, 
  Users, 
  Check,
  ArrowRight,
  Calendar,
  CreditCard,
  User,
  Armchair
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentOptions } from "@/components/PaymentOptions";

interface BookingData {
  name: string;
  email: string;
  phone: string;
  age: string;
  gender: "male" | "female" | "other";
  idNumber: string;
  selectedSeats: string[];
  paymentMethod: string;
  mobileMoneyProvider: string;
  mobileNumber: string;
}

export default function BookingPage() {
  const { routeId } = useParams<{ routeId: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "male",
    idNumber: "",
    selectedSeats: [],
    paymentMethod: "",
    mobileMoneyProvider: "",
    mobileNumber: "",
  });
  const selectedRoute = JSON.parse(localStorage.getItem("selectedRoute"));
  console.log("selected route ",selectedRoute[0])
  const {
    data: route,
    isLoading: isRouteLoading,
    error: routeError,
  } = useQuery({
    queryKey: ["route", routeId],
    queryFn: () => selectedRoute[0],
    enabled: !!routeId,
  });

  const createBookingMutation = useMutation({
    mutationFn: mockApi.createBooking,
    onSuccess: () => {
      toast({
        title: "Booking Confirmed!",
        description: "Your ticket has been booked successfully.",
      });
      setStep(5); // Move to confirmation step
      queryClient.invalidateQueries({ queryKey: ["bookings"] }); // Invalidate bookings cache
    },
    onError: (error) => {
      console.error("Error: ",error.message);
      toast({
        title: "Booking Failed",
        description: error.message || "An error occurred during booking.",
        variant: "destructive",
      });
      setStep(5); // Move to confirmation step even on error to show message
    },
  });

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handlePassengerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (
      !bookingData.name ||
      !bookingData.email ||
      !bookingData.phone ||
      !bookingData.age ||
      !bookingData.idNumber
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all passenger details.",
        variant: "destructive",
      });
      return;
    }
    handleNext();
  };

  const handleSeatSelect = (seatNumber: string) => {
    setBookingData((prev) => {
      const newSelectedSeats = prev.selectedSeats.includes(seatNumber)
        ? prev.selectedSeats.filter((seat) => seat !== seatNumber)
        : [...prev.selectedSeats, seatNumber];
      return { ...prev, selectedSeats: newSelectedSeats };
    });
  };

  const handleConfirmBooking = () => {
    if (!route) return;
    if (bookingData.selectedSeats.length === 0) {
      toast({
        title: "Selection Error",
        description: "Please select at least one seat.",
        variant: "destructive",
      });
      return;
    }
    if (!bookingData.paymentMethod) {
      toast({
        title: "Payment Error",
        description: "Please select a payment method.",
        variant: "destructive",
      });
      return;
    }
    if (bookingData.paymentMethod === "mobile_money") {
      if (!bookingData.mobileMoneyProvider || !bookingData.mobileNumber) {
        toast({
          title: "Mobile Money Error",
          description: "Please select a provider and enter your number.",
          variant: "destructive",
        });
        return;
      }
    }
    // Add more validation for bank card if needed  
    const newBooking = {
      agencyId: route.travelAgency.id,
      fullName: bookingData.name,
      email: bookingData.email,
      idCardNumber: bookingData.idNumber,
      startPoint : route.origin,
      endPoint : route.destination,
      paymentMethod:  bookingData.paymentMethod === "mobile_money" ? bookingData.mobileMoneyProvider : undefined,
      numberOfSeats : bookingData.selectedSeats.length,
      fleetType: "VIP", //not yet implemented
      departurePeriod : "Night"  
    };
    console.log(newBooking);
    createBookingMutation.mutate(newBooking);
  };

  if (isRouteLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading route details...</div>
      </div>
    );
  }
  console.log(route);
  console.log("Route origin ", route.origin);
  if (routeError || !route) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Error Loading Route</h1>
          <p className="text-muted-foreground">
            The selected route could not be found or an error occurred.
          </p>
          <Button asChild className="mt-4">
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Step indicator component
  const StepIndicator = () => {
    const steps = [
      { number: 1, title: "Passenger Info", icon: User, description: "Enter your details" },
      { number: 2, title: "Route Details", icon: Bus, description: "Confirm your journey" },
      { number: 3, title: "Select Seats", icon: Armchair, description: "Choose your seats" },
      { number: 4, title: "Payment", icon: CreditCard, description: "Complete payment" },
      { number: 5, title: "Confirmation", icon: CheckCircle, description: "Booking complete" }
    ];

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {/* Progress line */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-muted -z-10">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-in-out"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>
          
          {steps.map((stepItem, index) => {
            const isCompleted = step > stepItem.number;
            const isCurrent = step === stepItem.number;
            const isUpcoming = step < stepItem.number;
            
            return (
              <div key={stepItem.number} className="flex flex-col items-center relative">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${isCompleted ? 'bg-primary border-primary text-primary-foreground' : ''}
                  ${isCurrent ? 'bg-primary border-primary text-primary-foreground shadow-lg scale-110' : ''}
                  ${isUpcoming ? 'bg-background border-muted-foreground/30 text-muted-foreground' : ''}
                `}>
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <stepItem.icon className="w-5 h-5" />
                  )}
                </div>
                <div className="mt-2 text-center hidden sm:block">
                  <div className={`text-sm font-medium ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                    {stepItem.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stepItem.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Booking summary component
  const BookingSummary = () => {
    const totalAmount = route ? route.price * bookingData.selectedSeats.length : 0;
    
    return (
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bus className="w-5 h-5" />
            Booking Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Route Information */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Route</span>
              </div>
              <div className="text-right">
                <div className="font-medium text-sm">{route?.origin}</div>
                <ArrowRight className="w-3 h-3 mx-auto text-muted-foreground" />
                <div className="font-medium text-sm">{route?.destination}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Date</span>
              </div>
              <span className="text-sm font-medium">{route?.date || 'Today'}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Departure</span>
              </div>
              <span className="text-sm font-medium">{route?.departureTime}</span>
            </div>
          </div>

          <Separator />

          {/* Passenger Information */}
          {bookingData.name && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Passenger Details</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span>{bookingData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="truncate ml-2">{bookingData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span>{bookingData.phone}</span>
                </div>
              </div>
            </div>
          )}

          {/* Seat Selection */}
          {bookingData.selectedSeats.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Seat Selection</h4>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {bookingData.selectedSeats.length} seat{bookingData.selectedSeats.length > 1 ? 's' : ''}
                  </span>
                  <Badge variant="secondary">
                    {bookingData.selectedSeats.join(', ')}
                  </Badge>
                </div>
              </div>
            </>
          )}

          {/* Payment Method */}
          {bookingData.paymentMethod && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Payment Method</h4>
                <div className="text-sm">
                  <Badge variant="outline">
                    {bookingData.paymentMethod === 'mobile_money' ? 'Mobile Money' : 
                     bookingData.paymentMethod === 'bank_card' ? 'Bank Card' : 
                     bookingData.paymentMethod}
                  </Badge>
                  {bookingData.paymentMethod === 'mobile_money' && bookingData.mobileMoneyProvider && (
                    <div className="mt-1 text-muted-foreground">
                      {bookingData.mobileMoneyProvider} - {bookingData.mobileNumber}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Price Breakdown</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Ticket price × {bookingData.selectedSeats.length || 1}
                </span>
                <span>{((route?.price || 0) * (bookingData.selectedSeats.length || 1)).toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service fee</span>
                <span>0 FCFA</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">{totalAmount.toLocaleString()} FCFA</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Passenger Information</h2>
              <p className="text-muted-foreground">Please provide your personal details for the booking.</p>
            </div>
            
            <form onSubmit={handlePassengerSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={bookingData.name}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, name: e.target.value })
                    }
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={bookingData.email}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, email: e.target.value })
                    }
                    className="h-11"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="Enter your phone number"
                    value={bookingData.phone}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, phone: e.target.value })
                    }
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm font-medium">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={bookingData.age}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, age: e.target.value })
                    }
                    className="h-11"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-medium">Gender *</Label>
                  <Select
                    onValueChange={(value) =>
                      setBookingData({
                        ...bookingData,
                        gender: value as "male" | "female" | "other",
                      })
                    }
                    defaultValue={bookingData.gender}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idNumber" className="text-sm font-medium">ID Number *</Label>
                  <Input
                    id="idNumber"
                    placeholder="Enter your ID number"
                    value={bookingData.idNumber}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, idNumber: e.target.value })
                    }
                    className="h-11"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button type="submit" size="lg" className="px-8">
                  Continue to Route Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Confirm Route Details</h2>
              <p className="text-muted-foreground">Please review your selected journey details.</p>
            </div>
            
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{route.origin}</div>
                        <div className="text-sm text-muted-foreground">Departure</div>
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-muted-foreground" />
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-semibold text-right">{route.destination}</div>
                        <div className="text-sm text-muted-foreground text-right">Arrival</div>
                      </div>
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <Clock className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                      <div className="text-sm text-muted-foreground">Departure</div>
                      <div className="font-semibold">{route.departureTime}</div>
                    </div>
                    <div className="text-center">
                      <Clock className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                      <div className="text-sm text-muted-foreground">Arrival</div>
                      <div className="font-semibold">{route.arrivalTime}</div>
                    </div>
                    <div className="text-center">
                      <Bus className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                      <div className="text-sm text-muted-foreground">Bus Type</div>
                      <div className="font-semibold">{route.busType || "Classic"}</div>
                    </div>
                    <div className="text-center">
                      <Users className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                      <div className="text-sm text-muted-foreground">Available</div>
                      <div className="font-semibold">{route.availableSeats || 45} seats</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Price per seat</div>
                    <div className="text-3xl font-bold text-primary">{route.price.toLocaleString()} FCFA</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handleBack} size="lg" className="px-8">
                Back to Passenger Info
              </Button>
              <Button onClick={handleNext} size="lg" className="px-8">
                Continue to Seat Selection
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );
      case 3: {
        const maxSeats = route.availableSeats == null ? 45 : route.availableSeats;
        const seatOptions = Array.from({ length: Math.min(maxSeats, 10) }, (_, i) => i + 1);

        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Select Your Seats</h2>
              <p className="text-muted-foreground">Choose the number of seats you'd like to book for your journey.</p>
            </div>

            <Card className="border-2">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Armchair className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">How many seats do you need?</h3>
                    <p className="text-muted-foreground">Select the number of passengers traveling</p>
                  </div>

                  <div className="max-w-sm mx-auto space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="numSeats" className="text-sm font-medium">Number of Seats</Label>
                      <Select
                        value={
                          bookingData.selectedSeats.length
                            ? String(bookingData.selectedSeats.length)
                            : ""
                        }
                        onValueChange={(val) => {
                          const num = Number(val);
                          setBookingData((prev) => ({
                            ...prev,
                            selectedSeats: Array.from(
                              { length: num },
                              (_, i) => `S${i + 1}`
                            ),
                          }));
                        }}
                      >
                        <SelectTrigger id="numSeats" className="h-12 text-center">
                          <SelectValue placeholder="Select number of seats..." />
                        </SelectTrigger>
                        <SelectContent>
                          {seatOptions.map((num) => (
                            <SelectItem key={num} value={String(num)}>
                              <div className="flex items-center gap-2">
                                <Armchair className="w-4 h-4" />
                                {num} seat{num > 1 ? "s" : ""} - {(route.price * num).toLocaleString()} FCFA
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {bookingData.selectedSeats.length > 0 && (
                      <div className="text-center p-4 bg-primary/5 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Total for {bookingData.selectedSeats.length} seat{bookingData.selectedSeats.length > 1 ? 's' : ''}</div>
                        <div className="text-2xl font-bold text-primary">
                          {(route.price * bookingData.selectedSeats.length).toLocaleString()} FCFA
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground text-center">
                      Maximum {Math.min(maxSeats, 10)} seat{Math.min(maxSeats, 10) > 1 ? "s" : ""} can be booked at once
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handleBack} size="lg" className="px-8">
                Back to Route Details
              </Button>
              <Button
                onClick={handleNext}
                disabled={bookingData.selectedSeats.length === 0}
                size="lg"
                className="px-8"
              >
                Continue to Payment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );
      }
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Payment Information</h2>
              <p className="text-muted-foreground">Choose your preferred payment method to complete the booking.</p>
            </div>
            
            <PaymentOptions
              selectedPaymentMethod={bookingData.paymentMethod}
              setSelectedPaymentMethod={(method) =>
                setBookingData((prev) => ({ ...prev, paymentMethod: method }))
              }
              mobileMoneyProvider={bookingData.mobileMoneyProvider}
              setMobileMoneyProvider={(provider) =>
                setBookingData((prev) => ({
                  ...prev,
                  mobileMoneyProvider: provider,
                }))
              }
              mobileNumber={bookingData.mobileNumber}
              setMobileNumber={(num) =>
                setBookingData((prev) => ({ ...prev, mobileNumber: num }))
              }
              totalAmount={route.price * bookingData.selectedSeats.length}
            />
            
            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handleBack} size="lg" className="px-8">
                Back to Seat Selection
              </Button>
              <Button
                onClick={handleConfirmBooking}
                disabled={createBookingMutation.isPending}
                size="lg"
                className="px-8"
              >
                {createBookingMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    Complete Booking
                    <Check className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="text-center space-y-6 py-8">
            {createBookingMutation.isSuccess && (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h2>
                  <p className="text-muted-foreground text-lg">
                    Your bus ticket has been successfully booked. A confirmation email has been sent to your inbox.
                  </p>
                </div>
                
                <Card className="max-w-md mx-auto">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Booking ID:</span>
                        <span className="font-mono font-semibold">#BK{Date.now().toString().slice(-6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Passenger:</span>
                        <span className="font-semibold">{bookingData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Seats:</span>
                        <span className="font-semibold">{bookingData.selectedSeats.length}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg">
                        <span className="font-semibold">Total Paid:</span>
                        <span className="font-bold text-primary">
                          {(route.price * bookingData.selectedSeats.length).toLocaleString()} FCFA
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            {createBookingMutation.isError && (
              <>
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <XCircle className="h-10 w-10 text-red-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-red-600 mb-2">Booking Failed</h2>
                  <p className="text-muted-foreground text-lg">
                    {createBookingMutation.error?.message || "An unexpected error occurred while processing your booking."}
                  </p>
                </div>
              </>
            )}
            <div className="flex gap-4 justify-center">
              <Button asChild variant="outline" size="lg">
                <Link to="/bookings">View My Bookings</Link>
              </Button>
              <Button asChild size="lg">
                <Link to="/">Book Another Trip</Link>
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <SEO
        title="Complete Your Booking"
        description="Enter your details to complete your bus ticket booking. Secure your seat for travel across Cameroon with KamerWays Connect."
        keywords={[
          "complete booking",
          "passenger details",
          "bus ticket payment",
          "KamerWays Connect",
        ]}
      />
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Complete Your Booking</h1>
            <p className="text-muted-foreground text-lg">
              Follow the steps below to secure your bus ticket
            </p>
          </div>

          {/* Step Indicator */}
          <StepIndicator />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form Content */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  {renderStepContent()}
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary Sidebar */}
            <div className="lg:col-span-1">
              <BookingSummary />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}