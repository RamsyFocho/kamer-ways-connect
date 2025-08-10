import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SEO from '@/components/Seo';
import { useToast } from '@/hooks/use-toast';

export default function BookingPage() {
  const { routeId } = useParams();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: 'male' as const,
    idNumber: ''
  });

  const handleSubmit = () => {
    toast({ title: 'Booking Confirmed!', description: 'Your ticket has been booked successfully.' });
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
            <CardTitle>Step {step}: Passenger Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                />
              </div>
            </div>

            <Button onClick={handleSubmit} className="w-full">
              Confirm Booking
            </Button>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}