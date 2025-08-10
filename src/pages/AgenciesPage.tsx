import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Bus } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/Seo';
import { mockApi, Agency } from '@/lib/mock-data';

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    mockApi.getAgencies().then(setAgencies);
  }, []);

  const filteredAgencies = agencies.filter(agency =>
    agency.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="All Bus Agencies"
        description="Browse all bus agencies operating in Cameroon. Find the best travel companies for your journey and book your tickets with KamerWays Connect."
        keywords={["bus agencies Cameroon", "travel companies Cameroon", "KamerWays Express", "Cameroon Transit"]}
      />
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Bus Agencies</h1>
        
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search agencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgencies.map((agency) => (
            <Card key={agency.id} className="hover:shadow-brand-medium transition-all">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Bus className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle>{agency.name}</CardTitle>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span>{agency.rating}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{agency.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {agency.features.slice(0, 3).map(feature => (
                    <Badge key={feature} variant="secondary">{feature}</Badge>
                  ))}
                </div>
                <Button asChild className="w-full">
                  <Link to={`/agencies/${agency.id}`}>View Routes</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}