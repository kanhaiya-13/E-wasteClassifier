import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Navigation, Phone, Clock, ExternalLink } from "lucide-react";

interface RecyclingCenter {
  id: string;
  name: string;
  address: string;
  distance: string;
  acceptedItems: string[];
  phone?: string;
  hours?: string;
  rating?: number;
}

// Mock data - in production, this would come from an API
const mockCenters: RecyclingCenter[] = [
  {
    id: "1",
    name: "Green Planet E-Waste Recycling",
    address: "123 Eco Street, Downtown",
    distance: "1.2 km",
    acceptedItems: ["Batteries", "Circuit Boards", "Displays", "Metals"],
    phone: "+1-555-0123",
    hours: "Mon-Sat: 9AM-6PM",
    rating: 4.8,
  },
  {
    id: "2",
    name: "TechCycle Solutions",
    address: "456 Green Avenue, Tech Park",
    distance: "3.5 km",
    acceptedItems: ["Circuit Boards", "Plastics", "Mixed Electronics"],
    phone: "+1-555-0456",
    hours: "Mon-Fri: 8AM-5PM",
    rating: 4.6,
  },
  {
    id: "3",
    name: "EcoWaste Hub",
    address: "789 Recycle Road, Industrial Zone",
    distance: "5.8 km",
    acceptedItems: ["Batteries", "Displays", "Metals", "Plastics"],
    phone: "+1-555-0789",
    hours: "Daily: 7AM-7PM",
    rating: 4.9,
  },
  {
    id: "4",
    name: "Electronics Recycling Center",
    address: "321 Sustainability Lane, City Center",
    distance: "7.2 km",
    acceptedItems: ["All E-Waste Types"],
    phone: "+1-555-0321",
    hours: "Mon-Sat: 10AM-8PM",
    rating: 4.7,
  },
];

export const RecyclingCenterFinder = () => {
  const [location, setLocation] = useState("");
  const [centers, setCenters] = useState<RecyclingCenter[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setCenters(mockCenters);
      setIsSearching(false);
    }, 800);
  };

  const handleGetCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
          handleSearch();
        },
        (error) => {
          console.error("Error getting location:", error);
          // Use default mock location
          setLocation("Current Location");
          handleSearch();
        }
      );
    } else {
      setLocation("Current Location");
      handleSearch();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <MapPin className="w-8 h-8 text-primary" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Find Recycling Centers
          </h2>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Locate certified e-waste collection centers near you for responsible disposal
        </p>
      </div>

      <Card className="p-6 bg-gradient-card border-2">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Enter your location (city, zip code, or address)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="h-12 text-lg"
            />
          </div>
          <Button
            onClick={handleGetCurrentLocation}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <Navigation className="w-4 h-4" />
            Use My Location
          </Button>
          <Button
            onClick={handleSearch}
            size="lg"
            className="gap-2"
            disabled={isSearching}
          >
            <Search className="w-4 h-4" />
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>
      </Card>

      {centers.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              Found {centers.length} centers near you
            </h3>
            <Badge variant="secondary" className="text-sm">
              Sorted by distance
            </Badge>
          </div>

          <div className="grid gap-4">
            {centers.map((center) => (
              <Card
                key={center.id}
                className="p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xl font-semibold group-hover:text-primary transition-colors">
                          {center.name}
                        </h4>
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{center.address}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          {center.distance}
                        </Badge>
                        {center.rating && (
                          <div className="flex items-center gap-1 text-sm">
                            <span className="text-yellow-500">★</span>
                            <span className="font-semibold">{center.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {center.acceptedItems.map((item, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {center.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{center.phone}</span>
                        </div>
                      )}
                      {center.hours && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{center.hours}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2">
                    <Button variant="outline" size="sm" className="gap-2 flex-1">
                      <Navigation className="w-4 h-4" />
                      Get Directions
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 flex-1">
                      <ExternalLink className="w-4 h-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {centers.length === 0 && !isSearching && (
        <Card className="p-12 text-center border-dashed">
          <MapPin className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Search for Recycling Centers</h3>
          <p className="text-muted-foreground">
            Enter your location to find certified e-waste collection centers nearby
          </p>
        </Card>
      )}
    </div>
  );
};

