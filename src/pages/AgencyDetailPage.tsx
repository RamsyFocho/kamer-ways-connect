import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, MapPin, Users } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockApi, Agency, Route } from '@/lib/mock-data';

export default function AgencyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [agency, setAgency] = useState<Agency | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    if (id) {
      mockApi.getAgency(id).then(setAgency);
      mockApi.getRoutes({ agencyId: id }).then(setRoutes);
    }
  }, [id]);

  if (!agency) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">{agency.name}</h1>
        <p className="text-muted-foreground mb-8">{agency.description}</p>

        <h2 className="text-2xl font-bold mb-6">Available Routes</h2>
        <div className="grid gap-4">
          {routes.map((route) => (
            <Card key={route.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{route.from} → {route.to}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span>{route.departureTime} - {route.arrivalTime}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span>{route.availableSeats} seats available</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{route.price.toLocaleString()} FCFA</div>
                    <Button asChild>
                      <Link to={`/booking/${route.id}`}>Book Now</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}