import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, Users, Star, ArrowRight, Bus, Shield, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { mockApi, mockAgencies } from '@/lib/mock-data.ts';
import SEO from '@/components/Seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import HeroSection from '@/components/Hero/HeroSection';

const Index = () => {
  const { t } = useLanguage();
  const [agencies, setAgencies] = useState<typeof mockAgencies>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const data = await mockApi.getAgencies();
        setAgencies(data);
      } catch (error) {
        console.error('Error fetching agencies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgencies();
  }, []);

  const filteredAgencies = agencies.filter(agency =>
    agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agency.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { icon: Bus, label: 'Active Buses', value: '200+' },
    { icon: Users, label: 'Happy Customers', value: '50K+' },
    { icon: MapPin, label: 'Cities Connected', value: '25+' },
    { icon: Shield, label: 'Safety Rating', value: '99.9%' }
  ];

  const features = [
    { icon: Wifi, title: 'Free WiFi', description: 'Stay connected during your journey' },
    { icon: Shield, title: 'Safe Travel', description: 'GPS tracking and insurance coverage' },
    { icon: Clock, title: '24/7 Support', description: 'Round-the-clock customer assistance' },
    { icon: MapPin, title: 'Wide Network', description: 'Connecting major cities across Cameroon' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Book Bus Tickets Online in Cameroon"
        description="Easily book bus tickets for travel across Cameroon. Compare prices from top agencies, and enjoy a seamless booking experience with KamerWays Connect."
        keywords={["bus travel Cameroon", "online bus booking", "KamerWays", "Douala to Yaounde", "bus tickets","Bus","Cameroon","Africa","Douala","Yaounde","Bamenda","Travel","Bus Travel","Bus Booking"]}
      />
      
      {/* SEO Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "KamerWays Connect",
          "url": "https://kamer-ways-connect.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://kamer-ways-connect.com/agencies?search={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })
      }} />
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "KamerWays Connect",
          "url": "https://kamer-ways-connect.com",
          "logo": "https://kamer-ways-connect.com/logo.png",
          "sameAs": [
            "https://www.facebook.com/kamerwaysconnect",
            "https://twitter.com/kamerwaysconnect",
            "https://www.instagram.com/kamerwaysconnect"
          ]
        })
      }} />
      <Header />
      
      {/* Hero Section */}
      <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-lg mb-4">
                  <stat.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="text-2xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Agencies */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('agencies.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our trusted network of bus agencies for a comfortable and safe journey
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-lg">{t('common.loading')}</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAgencies.map((agency, index) => (
                <motion.div
                  key={agency.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-brand-medium transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Bus className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{agency.name}</CardTitle>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-warning text-warning" />
                            <span className="text-sm font-medium">{agency.rating}</span>
                            <span className="text-sm text-muted-foreground">
                              ({agency.reviewCount} {t('agencies.reviews')})
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription className="line-clamp-2">
                        {agency.description}
                      </CardDescription>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('agencies.established')}:</span>
                          <span className="font-medium">{agency.established}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('agencies.fleetSize')}:</span>
                          <span className="font-medium">{agency.fleetSize} {t('agencies.buses')}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {agency.features.slice(0, 3).map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      <Button className="w-full group" asChild>
                        <Link to={`/agencies/${agency.id}`}>
                          {t('home.bookNow')}
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose KamerWays?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the best in bus travel with our modern amenities and dedicated service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6">
                  <feature.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
