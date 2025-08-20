import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate} from 'react-router-dom';
import { Clock, MapPin, Users } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SEO from '@/components/Seo';
import { mockApi, Agency, Route } from '@/lib/mock-data';

export default function AgencyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [agency, setAgency] = useState<Agency | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      mockApi.getAgency(id).then(setAgency);
      mockApi.getRoutes({ agencyId: id }).then(setRoutes);
    }
  }, [id]);

  if (!agency) return <div>Loading...</div>;
  console.log(agency);

  const handleRedirectBooking = (routeId)=>{
    try{
      const selectedRoute = routes.filter((r) => r.id === routeId);
      console.log("selected route ", selectedRoute);
      localStorage.setItem("selectedRoute",JSON.stringify(selectedRoute));
      navigate(`/booking/${routeId}`);
    }catch(err){
      console.error("Error: ", err);
    }
  }
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={`${agency.name} - Bus Routes & Booking`}
        description={`Find and book bus tickets for routes operated by ${agency.name}. View schedules, prices, and available seats for travel across Cameroon.`}
        keywords={[agency.name, "bus routes", "book tickets", ...routes.map(r => `${r.origin} to ${r.destination}`)]}
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">{agency.name}</h1>
        <p className="text-muted-foreground mb-8">{agency.description || "Luxury bus services with premium amenities for discerning travelers."}</p>

        <h2 className="text-2xl font-bold mb-6">Available Routes</h2>
        <div className="grid gap-4">
          {routes.map((route) => (
            <Card key={route.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{route.origin} → {route.destination}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span>{route.departureTime} - {route.arrivalTime}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span>{route.availableSeats || 45} seats available</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{route.price.toLocaleString()} FCFA</div>
                    <Button onClick={()=> handleRedirectBooking(route.id)}>
                      Book Now
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