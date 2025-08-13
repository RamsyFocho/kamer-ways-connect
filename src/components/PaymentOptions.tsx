import React, {useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from './ui/skeleton';

interface PaymentOptionsProps {
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (method: string) => void;
  mobileMoneyProvider: string;
  setMobileMoneyProvider: (provider: string) => void;
  mobileNumber: string;
  setMobileNumber: (number: string) => void;
  totalAmount?: number | null; // Allow null/undefined without throwing
}

export function PaymentOptions({
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  mobileMoneyProvider,
  setMobileMoneyProvider,
  mobileNumber,
  setMobileNumber,
  totalAmount,
}: PaymentOptionsProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a short delay for shimmer effect until totalAmount is ready
    if (totalAmount !== undefined && totalAmount !== null) {
      setIsLoading(false);
    }
  }, [totalAmount]);
   if (isLoading) {
    return (
      <div className="p-4">
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Select Payment Method</h3>

      <Card>
        <CardHeader>
          <CardTitle>Total Amount: <span className="font-bold text-primary">{totalAmount.toLocaleString() || "NAN"} FCFA</span></CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={selectedPaymentMethod}
            onValueChange={setSelectedPaymentMethod}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Label
              htmlFor="mobile-money"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem value="mobile_money" id="mobile-money" className="sr-only" />
              <div className="flex items-center space-x-2">
                <img src="/placeholder.svg" alt="Mobile Money" className="h-8 w-8" /> {/* Replace with actual icons */}
                <span>Mobile Money</span>
              </div>
            </Label>
            <Label
              htmlFor="bank-card"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem value="bank_card" id="bank-card" className="sr-only" />
              <div className="flex items-center space-x-2">
                <img src="/placeholder.svg" alt="Bank Card" className="h-8 w-8" /> {/* Replace with actual icons */}
                <span>Bank Card</span>
              </div>
            </Label>
            {/* Add more payment options here */}
          </RadioGroup>

          {selectedPaymentMethod === 'mobile_money' && (
            <div className="space-y-4 mt-6 p-4 border rounded-md">
              <h4 className="text-lg font-medium">Mobile Money Details</h4>
              <RadioGroup
                value={mobileMoneyProvider}
                onValueChange={setMobileMoneyProvider}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <Label
                  htmlFor="mtn"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <RadioGroupItem value="mtn" id="mtn" className="sr-only" />
                  <div className="flex items-center space-x-2">
                    <img src="/placeholder.svg" alt="MTN" className="h-8 w-8" /> {/* Replace with actual MTN logo */}
                    <span>MTN Mobile Money</span>
                  </div>
                </Label>
                <Label
                  htmlFor="orange"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <RadioGroupItem value="orange" id="orange" className="sr-only" />
                  <div className="flex items-center space-x-2">
                    <img src="/placeholder.svg" alt="Orange" className="h-8 w-8" /> {/* Replace with actual Orange logo */}
                    <span>Orange Money</span>
                  </div>
                </Label>
              </RadioGroup>

              {mobileMoneyProvider && (
                <div className="mt-4">
                  <Label htmlFor="mobile-number">Mobile Number ({mobileMoneyProvider.toUpperCase()})</Label>
                  <Input
                    id="mobile-number"
                    type="tel"
                    placeholder="e.g., 678123456"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>
          )}

          {selectedPaymentMethod === 'bank_card' && (
            <div className="space-y-4 mt-6 p-4 border rounded-md">
              <h4 className="text-lg font-medium">Bank Card Details</h4>
              <p className="text-muted-foreground">
                Integration for bank card payments would go here. This would typically involve
                fields for card number, expiry date, CVV, and cardholder name.
              </p>
              {/* Placeholder for bank card form fields */}
              <Input placeholder="Card Number" disabled />
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Expiry Date (MM/YY)" disabled />
                <Input placeholder="CVV" disabled />
              </div>
              <Input placeholder="Cardholder Name" disabled />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

