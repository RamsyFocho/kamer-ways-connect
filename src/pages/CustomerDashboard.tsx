import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CustomerDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Travel History</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Your booking history and upcoming trips will appear here.</p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}