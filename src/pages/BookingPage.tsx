import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SEO from '@/components/Seo';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockApi, Route } from '@/lib/mock-data';
import { CheckCircle, XCircle, Bus, MapPin, Clock, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaymentOptions } from '@/components/PaymentOptions';

interface BookingData {
  name: string;
  email: string;
  phone: string;
  age: string;
  gender: 'male' | 'female' | 'other';
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
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: 'male',
    idNumber: '',
    selectedSeats: [],
    paymentMethod: '',
    mobileMoneyProvider: '',
    mobileNumber: '',
  });

  const { data: route, isLoading: isRouteLoading, error: routeError } = useQuery({
    queryKey: ['route', routeId],
    queryFn: () => mockApi.getRoute(routeId!),
    enabled: !!routeId,
  });

  const createBookingMutation = useMutation({
    mutationFn: mockApi.createBooking,
    onSuccess: () => {
      toast({ title: 'Booking Confirmed!', description: 'Your ticket has been booked successfully.' });
      setStep(5); // Move to confirmation step
      queryClient.invalidateQueries({ queryKey: ['bookings'] }); // Invalidate bookings cache
    },
    onError: (error) => {
      toast({ title: 'Booking Failed', description: error.message || 'An error occurred during booking.', variant: 'destructive' });
      setStep(5); // Move to confirmation step even on error to show message
    },
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handlePassengerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!bookingData.name || !bookingData.email || !bookingData.phone || !bookingData.age || !bookingData.idNumber) {
      toast({ title: 'Validation Error', description: 'Please fill in all passenger details.', variant: 'destructive' });
      return;
    }
    handleNext();
  };

  const handleSeatSelect = (seatNumber: string) => {
    setBookingData(prev => {
      const newSelectedSeats = prev.selectedSeats.includes(seatNumber)
        ? prev.selectedSeats.filter(seat => seat !== seatNumber)
        : [...prev.selectedSeats, seatNumber];
      return { ...prev, selectedSeats: newSelectedSeats };
    });
  };

  const handleConfirmBooking = () => {
    if (!route) return;
    if (bookingData.selectedSeats.length === 0) {
      toast({ title: 'Selection Error', description: 'Please select at least one seat.', variant: 'destructive' });
      return;
    }
    if (!bookingData.paymentMethod) {
      toast({ title: 'Payment Error', description: 'Please select a payment method.', variant: 'destructive' });
      return;
    }
    if (bookingData.paymentMethod === 'mobile_money') {
      if (!bookingData.mobileMoneyProvider || !bookingData.mobileNumber) {
        toast({ title: 'Mobile Money Error', description: 'Please select a provider and enter your number.', variant: 'destructive' });
        return;
      }
    }
    // Add more validation for bank card if needed
    const newBooking = {
      userId: 'user-1', // Mock user ID
      routeId: route.id,
      agencyId: route.agencyId,
      passengerDetails: {
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        age: Number(bookingData.age),
        gender: bookingData.gender,
        idNumber: bookingData.idNumber,
      },
      seatNumbers: bookingData.selectedSeats,
      totalAmount: route.price * bookingData.selectedSeats.length,
      status: 'pending', // Initial status
      bookingDate: new Date().toISOString().split('T')[0],
      paymentMethod: bookingData.paymentMethod,
      paymentStatus: 'pending', // Default mock payment status
      mobileMoneyProvider: bookingData.paymentMethod === 'mobile_money' ? bookingData.mobileMoneyProvider : undefined,
      mobileNumber: bookingData.paymentMethod === 'mobile_money' ? bookingData.mobileNumber : undefined,
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

  if (routeError || !route) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Error Loading Route</h1>
          <p className="text-muted-foreground">The selected route could not be found or an error occurred.</p>
          <Button asChild className="mt-4"><Link to="/">Go Home</Link></Button>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handlePassengerSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={bookingData.name}
                  onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={bookingData.phone}
                  onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={bookingData.age}
                  onChange={(e) => setBookingData({...bookingData, age: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={value => setBookingData({ ...bookingData, gender: value as 'male' | 'female' | 'other' })} defaultValue={bookingData.gender}>
                  <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="idNumber">ID Number</Label>
              <Input
                id="idNumber"
                value={bookingData.idNumber}
                onChange={(e) => setBookingData({...bookingData, idNumber: e.target.value})}
                required
              />
            </div>

            <Button type="submit" className="w-full">Next: Confirm Route</Button>
          </form>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Confirm Route Details</h3>
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>From: <span className="font-medium">{route.from}</span> to <span className="font-medium">{route.to}</span></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Departure: <span className="font-medium">{route.departureTime}</span>, Arrival: <span className="font-medium">{route.arrivalTime}</span></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bus className="h-4 w-4 text-muted-foreground" />
                  <span>Bus Type: <span className="font-medium">{route.busType}</span></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Available Seats: <span className="font-medium">{route.availableSeats}</span></span>
                </div>
                <div className="text-2xl font-bold text-primary mt-4">Price: {route.price.toLocaleString()} FCFA</div>
              </CardContent>
            </Card>
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext}>Next: Select Seats</Button>
            </div>
          </div>
        );
      case 3: {
        // Ask user how many seats they want (dropdown)
        const maxSeats = route.availableSeats;
        const seatOptions = Array.from({ length: maxSeats }, (_, i) => i + 1);
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">How many seats do you want to book?</h3>
            <div className="w-64">
              <Label htmlFor="numSeats">Number of Seats</Label>
              <Select
                value={bookingData.selectedSeats.length ? String(bookingData.selectedSeats.length) : ''}
                onValueChange={val => {
                  const num = Number(val);
                  // Auto-select seat numbers S1, S2, ...
                  setBookingData(prev => ({
                    ...prev,
                    selectedSeats: Array.from({ length: num }, (_, i) => `S${i + 1}`)
                  }));
                }}
              >
                <SelectTrigger id="numSeats">
                  <SelectValue placeholder="Select number of seats" />
                </SelectTrigger>
                <SelectContent>
                  {seatOptions.map(num => (
                    <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext} disabled={bookingData.selectedSeats.length === 0}>Next: Payment</Button>
            </div>
          </div>
        );
      }
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Payment Information</h3>
            <PaymentOptions
              selectedPaymentMethod={bookingData.paymentMethod}
              setSelectedPaymentMethod={method => setBookingData(prev => ({ ...prev, paymentMethod: method }))}
              mobileMoneyProvider={bookingData.mobileMoneyProvider}
              setMobileMoneyProvider={provider => setBookingData(prev => ({ ...prev, mobileMoneyProvider: provider }))}
              mobileNumber={bookingData.mobileNumber}
              setMobileNumber={num => setBookingData(prev => ({ ...prev, mobileNumber: num }))}
              totalAmount={route.price * bookingData.selectedSeats.length}
            />
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button onClick={handleConfirmBooking} disabled={createBookingMutation.isPending}>
                {createBookingMutation.isPending ? 'Confirming...' : 'Confirm Booking'}
              </Button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="text-center space-y-4">
            {createBookingMutation.isSuccess && (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <h3 className="text-2xl font-bold">Booking Successful!</h3>
                <p className="text-muted-foreground">Your booking has been confirmed. A confirmation email will be sent shortly.</p>
                <p className="text-lg font-semibold">Total Paid: {(route.price * bookingData.selectedSeats.length).toLocaleString()} FCFA</p>
              </>
            )}
            {createBookingMutation.isError && (
              <>
                <XCircle className="h-16 w-16 text-destructive mx-auto" />
                <h3 className="text-2xl font-bold">Booking Failed!</h3>
                <p className="text-muted-foreground">{createBookingMutation.error?.message || 'An unexpected error occurred.'}</p>
              </>
            )}
            <Button asChild className="mt-4"><Link to="/">Go to Home</Link></Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Complete Your Booking"
        description="Enter your details to complete your bus ticket booking. Secure your seat for travel across Cameroon with KamerWays Connect."
        keywords={["complete booking", "passenger details", "bus ticket payment", "KamerWays Connect"]}
      />
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Book Your Journey</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Step {step}: {step === 1 ? 'Passenger Information' : step === 2 ? 'Confirm Route' : step === 3 ? 'Select Seats' : step === 4 ? 'Payment' : 'Confirmation'}</CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
