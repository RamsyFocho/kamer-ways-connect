import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Clock, MapPin, Users } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SEO from "@/components/Seo";
import { getRoutes, getAgency } from "@/lib/api-client";
import { Agency, Route } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";

export default function AgencyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [agency, setAgency] = useState<Agency | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      getAgency(id).then(setAgency);
      getRoutes({ agencyId: id }).then(setRoutes);
    }
  }, [id]);
  if (!agency) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="h-full">
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  console.log(agency);

  const handleRedirectBooking = (routeId) => {
    try {
      const selectedRoute = routes.filter((r) => r.id === routeId);
      console.log("selected route ", selectedRoute);
      localStorage.setItem("selectedRoute", JSON.stringify(selectedRoute));
      navigate(`/booking/${routeId}`);
    } catch (err) {
      console.error("Error: ", err);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${agency.name} - Bus Routes & Booking`}
        description={`Find and book bus tickets for routes operated by ${agency.name}. View schedules, prices, and available seats for travel across Cameroon.`}
        keywords={[
          agency.name,
          "bus routes",
          "book tickets",
          ...routes.map((r) => `${r.origin} to ${r.destination}`),
        ]}
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">{agency.name}</h1>
        <p className="text-muted-foreground mb-8">
          {agency.description ||
            "Luxury bus services with premium amenities for discerning travelers."}
        </p>

        <h2 className="text-2xl font-bold mb-6">Available Routes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {routes.map((route) => (
            <Card
              key={route.id}
              className="h-full hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6 h-full flex flex-col">
                {/* Route Information */}
                <div className="flex-1 space-y-4">
                  {/* Origin → Destination */}
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <span className="font-medium text-sm md:text-base">
                      {route.origin} → {route.destination}
                    </span>
                  </div>

                  {/* Departure - Arrival Time */}
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      {route.departureTime} - {route.arrivalTime}
                    </span>
                  </div>

                  {/* Available Seats */}
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      {route.availableSeats || 45} seats available
                    </span>
                  </div>
                </div>

                {/* Price and Book Button */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {route.price.toLocaleString()} FCFA
                      </div>
                      <div className="text-sm text-muted-foreground">
                        per person
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRedirectBooking(route.id)}
                    className="w-full"
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
