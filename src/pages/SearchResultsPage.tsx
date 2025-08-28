import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  Users,
  Star,
  Filter,
  SlidersHorizontal,
  Bus,
  Calendar,
  ArrowRight,
  Wifi,
  Coffee,
  Zap,
  Shield,
  Search,
  ArrowLeft,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { getRoutes, getAgencies } from '@/lib/api-client';
import { Route, Agency } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import SEO from "@/components/Seo";
import { motion } from "framer-motion";

interface SearchFilters {
  minPrice: number;
  maxPrice: number;
  busTypes: string[];
  amenities: string[];
  agencies: string[];
  departureTimeRange: string;
  searchQuery: string;
}

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [allRoutes, setAllRoutes] = useState<Route[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("price");
  const navigate = useNavigate();
  const [hasSearched, setHasSearched] = useState(false);
  
  // Search parameters
  const origin = searchParams.get("origin") || "";
  const destination = searchParams.get("destination") || "";
  const date = searchParams.get("date") || "";
  
  // Filter states
  const [filters, setFilters] = useState<SearchFilters>({
    minPrice: 0,
    maxPrice: 100000,
    busTypes: [],
    amenities: [],
    agencies: [],
    departureTimeRange: "all",
    searchQuery: "",
  });

  // Available filter options
  const busTypes = ["Express", "Standard", "Luxury", "Night Express"];
  const amenitiesOptions = ["WiFi", "AC", "Meals", "Entertainment", "Charging Ports", "Reclining Seats"];
  const timeRanges = [
    { value: "all", label: "Any Time" },
    { value: "morning", label: "Morning (6AM - 12PM)" },
    { value: "afternoon", label: "Afternoon (12PM - 6PM)" },
    { value: "evening", label: "Evening (6PM - 12AM)" },
    { value: "night", label: "Night (12AM - 6AM)" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setHasSearched(!!(origin || destination || date));
      
      try {
        const [routesData, agenciesData] = await Promise.all([
          getRoutes({
            origin,
            destination,
            date,
          }),
          getAgencies(),
        ]);
        
        setRoutes(routesData);
        setAllRoutes(routesData);
        setAgencies(agenciesData);
        console.log("Routes data =>", routesData);
        
        // Set initial price range based on available routes
        if (routesData.length > 0) {
          const prices = routesData.map(r => r.price || 0);
          setFilters(prev => ({
            ...prev,
            minPrice: Math.min(...prices),
            maxPrice: Math.max(...prices),
          }));
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [origin, destination, date]);

  // Filter and sort routes
  const filteredAndSortedRoutes = React.useMemo(() => {
    let filtered = routes.filter(route => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch = 
          route.origin?.toLowerCase().includes(query) ||
          route.destination?.toLowerCase().includes(query) ||
          route.travelAgency?.name?.toLowerCase().includes(query) ||
          route.busType?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Price filter - added null check for route.price
      const routePrice = route.price || 0;
      if (routePrice < filters.minPrice || routePrice > filters.maxPrice) {
        return false;
      }

      // Bus type filter - added null check for route.busType
      if (filters.busTypes.length > 0 && route.busType && !filters.busTypes.includes(route.busType)) {
        return false;
      }

      // Amenities filter - added null check for route.amenities
      if (filters.amenities.length > 0) {
        const routeAmenities = route.amenities || ["wifi","meals","charging ports"];
        const hasAllAmenities = filters.amenities.every(amenity =>
          routeAmenities.includes(amenity.toLowerCase())
        );
        if (!hasAllAmenities) return false;
      }

      // Agency filter - added null checks for agencyId and travelAgency
      if (filters.agencies.length > 0) {
        const agencyMatch = 
          (route.agencyId && filters.agencies.includes(route.agencyId)) || 
          (route.travelAgency?.id && filters.agencies.includes(route.travelAgency.id.toString()));
        if (!agencyMatch) return false;
      }

      // Time range filter - added comprehensive null checks for departureTime
      if (filters.departureTimeRange !== "all" && route.departureTime) {
        const timeStr = route.departureTime.includes("T") ? 
          route.departureTime.split("T")[1] : route.departureTime;
        
        // Extract hour safely
        let hour = 0;
        if (timeStr) {
          const timeParts = timeStr.split(":");
          if (timeParts.length > 0) {
            hour = parseInt(timeParts[0]) || 0;
          }
        }
        
        switch (filters.departureTimeRange) {
          case "morning":
            if (hour < 6 || hour >= 12) return false;
            break;
          case "afternoon":
            if (hour < 12 || hour >= 18) return false;
            break;
          case "evening":
            if (hour < 18 || hour >= 24) return false;
            break;
          case "night":
            if (hour >= 6) return false;
            break;
        }
      }

      return true;
    });

    // Sort routes with null checks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return (a.price || 0) - (b.price || 0);
        case "duration":
          return (a.duration || "").localeCompare(b.duration || "");
        case "departure":
          return (a.departureTime || "").localeCompare(b.departureTime || "");
        case "availability":
          return (b.availableSeats || 0) - (a.availableSeats || 0);
        case "agency":
          return (a.travelAgency?.name || "").localeCompare(b.travelAgency?.name || "");
        default:
          return 0;
      }
    });

    return filtered;
  }, [routes, filters, sortBy]);

  const getAgencyName = (agencyId: string) => {
    const agency = agencies.find(a => a.id === agencyId);
    return agency?.name || "Unknown Agency";
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-3 w-3" />;
      case "meals":
        return <Coffee className="h-3 w-3" />;
      case "charging ports":
        return <Zap className="h-3 w-3" />;
      default:
        return <Shield className="h-3 w-3" />;
    }
  };

  const updateSearchParams = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const loadAllRoutes = async () => {
    setIsLoading(true);
    try {
      const routesData = await getRoutes({});
      setRoutes(routesData);
      setAllRoutes(routesData);
      setHasSearched(false);
      // Update URL to remove search params
      setSearchParams({});
    } catch (error) {
      console.error("Error loading all routes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const FilterSheet = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Results</SheetTitle>
          <SheetDescription>
            Refine your search to find the perfect trip
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          {/* Search Query */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Search Routes</Label>
            <Input
              placeholder="Search by city, agency, or bus type..."
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters(prev => ({ ...prev, searchQuery: e.target.value }))
              }
            />
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Price Range (FCFA)</Label>
            <div className="px-2">
              <Slider
                value={[filters.minPrice, filters.maxPrice]}
                onValueChange={([min, max]) =>
                  setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }))
                }
                max={Math.max(100000, ...routes.map(r => r.price || 0))}
                min={Math.min(0, ...routes.map(r => r.price || 0))}
                step={500}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>{filters.minPrice.toLocaleString()}</span>
                <span>{filters.maxPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Bus Types */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Bus Type</Label>
            <div className="space-y-2">
              {busTypes.map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`bustype-${type}`}
                    checked={filters.busTypes.includes(type)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFilters(prev => ({
                          ...prev,
                          busTypes: [...prev.busTypes, type]
                        }));
                      } else {
                        setFilters(prev => ({
                          ...prev,
                          busTypes: prev.busTypes.filter(t => t !== type)
                        }));
                      }
                    }}
                  />
                  <Label htmlFor={`bustype-${type}`}>{type}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Amenities</Label>
            <div className="space-y-2">
              {amenitiesOptions.map(amenity => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={`amenity-${amenity}`}
                    checked={filters.amenities.includes(amenity)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFilters(prev => ({
                          ...prev,
                          amenities: [...prev.amenities, amenity]
                        }));
                      } else {
                        setFilters(prev => ({
                          ...prev,
                          amenities: prev.amenities.filter(a => a !== amenity)
                        }));
                      }
                    }}
                  />
                  <Label htmlFor={`amenity-${amenity}`} className="flex items-center gap-2">
                    {getAmenityIcon(amenity)}
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Agencies */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Travel Agency</Label>
            <div className="space-y-2">
              {agencies.map(agency => (
                <div key={agency.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`agency-${agency.id}`}
                    checked={filters.agencies.includes(agency.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFilters(prev => ({
                          ...prev,
                          agencies: [...prev.agencies, agency.id]
                        }));
                      } else {
                        setFilters(prev => ({
                          ...prev,
                          agencies: prev.agencies.filter(a => a !== agency.id)
                        }));
                      }
                    }}
                  />
                  <Label htmlFor={`agency-${agency.id}`}>{agency.name}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Departure Time */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Departure Time</Label>
            <Select
              value={filters.departureTimeRange}
              onValueChange={(value) =>
                setFilters(prev => ({ ...prev, departureTimeRange: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map(range => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setFilters({
              minPrice: Math.min(0, ...routes.map(r => r.price || 0)),
              maxPrice: Math.max(100000, ...routes.map(r => r.price || 0)),
              busTypes: [],
              amenities: [],
              agencies: [],
              departureTimeRange: "all",
              searchQuery: "",
            })}
          >
            Clear All Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={hasSearched && origin && destination ? 
          `Bus Routes from ${origin} to ${destination} - KamerWays Connect` :
          "All Bus Routes & Trips - KamerWays Connect"
        }
        description={hasSearched && origin && destination ?
          `Find and book bus tickets from ${origin} to ${destination}. Compare prices, schedules, and amenities from top bus agencies in Cameroon.` :
          "Browse all available bus routes and trips in Cameroon. Compare prices, schedules, and book your perfect journey with top travel agencies."
        }
        keywords={[
          "bus routes",
          "bus trips", 
          "Cameroon travel",
          "bus booking",
          "travel agencies",
          "bus tickets",
          ...(origin ? [origin] : []),
          ...(destination ? [destination] : []),
        ]}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {hasSearched && origin && destination ? `${origin} to ${destination}` : "All Available Routes"}
              </h1>
              <p className="text-muted-foreground">
                {hasSearched && date && `Departure: ${new Date(date).toLocaleDateString()}`}
                {!isLoading && ` • ${filteredAndSortedRoutes.length} routes found`}
              </p>
            </div>
            
            {/* Search Form */}
            <Card className="lg:w-auto w-full">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    placeholder="From"
                    value={origin}
                    onChange={(e) => updateSearchParams("origin", e.target.value)}
                    className="sm:w-32"
                  />
                  <Input
                    placeholder="To"
                    value={destination}
                    onChange={(e) => updateSearchParams("destination", e.target.value)}
                    className="sm:w-32"
                  />
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => updateSearchParams("date", e.target.value)}
                    className="sm:w-40"
                  />
                  <Button size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <FilterSheet />
            
            <div className="flex items-center gap-2">
              <Label htmlFor="sort" className="text-sm font-medium">
                Sort by:
              </Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price (Low to High)</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="departure">Departure Time</SelectItem>
                  <SelectItem value="availability">Availability</SelectItem>
                  <SelectItem value="agency">Travel Agency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                    <div className="text-right space-y-2">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-10 w-32" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredAndSortedRoutes.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No routes found</h3>
              <p className="text-muted-foreground mb-6">
                {hasSearched 
                  ? "No routes match your search criteria. Try adjusting your filters or load all available trips."
                  : "No routes available at the moment. Please try again later."
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {hasSearched && (
                  <>
                    <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Go Back
                    </Button>
                    <Button onClick={loadAllRoutes} className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Load All Trips
                    </Button>
                  </>
                )}
                {!hasSearched && (
                  <Button variant="outline" onClick={() => navigate("/")}>
                    Return Home
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedRoutes.map((route, index) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Route Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">
                            {route.travelAgency?.name || getAgencyName(route.agencyId || "")}
                          </h3>
                          <Badge variant="secondary">{route.busType || "Standard"}</Badge>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{route.origin || "Unknown"}</span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{route.destination || "Unknown"}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              {route.departureTime && route.departureTime.includes("T") 
                                ? new Date(route.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                                : route.departureTime || "N/A"
                              } - {route.arrivalTime && route.arrivalTime.includes("T") 
                                ? new Date(route.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                                : route.arrivalTime || "N/A"
                              }
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{route.duration || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{route.availableSeats || 0} seats available</span>
                          </div>
                        </div>

                        {/* Amenities */}
                        <div className="flex flex-wrap gap-2">
                          {(route.amenities || ["wifi","meals","charging ports"]).slice(0, 4).map(amenity => (
                            <Badge key={amenity} variant="outline" className="text-xs">
                              <span className="mr-1">{getAmenityIcon(amenity)}</span>
                              {amenity}
                            </Badge>
                          ))}
                          {(route.amenities || []).length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{(route.amenities || []).length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Price and Book */}
                      <div className="lg:text-right space-y-3">
                        <div>
                          <div className="text-2xl font-bold text-primary">
                            {(route.price || 0).toLocaleString()} FCFA
                          </div>
                          <div className="text-sm text-muted-foreground">
                            per person
                          </div>
                        </div>
                        
                        <Button asChild className="w-full lg:w-auto">
                          <Link to={`/booking/${route.id}`}>
                            Book Now
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;