import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Navigation, Phone, Clock, ExternalLink, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RecyclingCenter {
  id: string;
  name: string;
  address: string;
  distance: string;
  acceptedItems: string[];
  phone?: string;
  hours?: string;
  lat: number;
  lon: number;
  website?: string;
}

interface Coordinates {
  lat: number;
  lon: number;
}

export const RecyclingCenterFinder = () => {
  const [location, setLocation] = useState("");
  const [centers, setCenters] = useState<RecyclingCenter[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
  const { toast } = useToast();

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    return `${distance.toFixed(1)} km`;
  };

  // Geocode address to coordinates using Nominatim
  const geocodeAddress = async (address: string): Promise<Coordinates | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
        {
          headers: {
            'User-Agent': 'SmartESort/1.0'
          }
        }
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // Search for recycling centers using Overpass API (OpenStreetMap)
  const searchRecyclingCenters = async (coords: Coordinates) => {
    setIsSearching(true);
    
    try {
      // Overpass API query for recycling centers within 25km radius
      const radius = 25000; // 25km in meters
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="recycling"]["recycling_type"="centre"](around:${radius},${coords.lat},${coords.lon});
          node["amenity"="waste_disposal"](around:${radius},${coords.lat},${coords.lon});
          node["shop"="electronics"]["recycling"="yes"](around:${radius},${coords.lat},${coords.lon});
          way["amenity"="recycling"]["recycling_type"="centre"](around:${radius},${coords.lat},${coords.lon});
          way["amenity"="waste_disposal"](around:${radius},${coords.lat},${coords.lon});
        );
        out center;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
      });

      const data = await response.json();
      
      if (data.elements && data.elements.length > 0) {
        const foundCenters: RecyclingCenter[] = data.elements
          .map((element: any) => {
            const lat = element.lat || element.center?.lat;
            const lon = element.lon || element.center?.lon;
            
            if (!lat || !lon) return null;

            const tags = element.tags || {};
            const name = tags.name || tags.operator || "Recycling Center";
            const street = tags['addr:street'] || '';
            const houseNumber = tags['addr:housenumber'] || '';
            const city = tags['addr:city'] || '';
            const address = [houseNumber, street, city].filter(Boolean).join(' ') || 'Address not available';
            
            // Determine accepted items based on tags
            const acceptedItems: string[] = [];
            if (tags.recycling_accepts) {
              acceptedItems.push(...tags.recycling_accepts.split(';'));
            }
            if (tags['recycling:batteries'] === 'yes') acceptedItems.push('Batteries');
            if (tags['recycling:electrical_items'] === 'yes') acceptedItems.push('Electronics');
            if (tags['recycling:small_appliances'] === 'yes') acceptedItems.push('Small Appliances');
            if (tags['recycling:computers'] === 'yes') acceptedItems.push('Computers');
            if (tags['recycling:mobile_phones'] === 'yes') acceptedItems.push('Mobile Phones');
            if (acceptedItems.length === 0) acceptedItems.push('E-Waste');

            return {
              id: element.id.toString(),
              name: name,
              address: address,
              distance: calculateDistance(coords.lat, coords.lon, lat, lon),
              acceptedItems: [...new Set(acceptedItems)], // Remove duplicates
              phone: tags.phone || tags['contact:phone'],
              hours: tags.opening_hours,
              lat: lat,
              lon: lon,
              website: tags.website || tags['contact:website']
            };
          })
          .filter((center): center is RecyclingCenter => center !== null)
          .sort((a, b) => {
            // Sort by distance
            const distA = parseFloat(a.distance);
            const distB = parseFloat(b.distance);
            return distA - distB;
          })
          .slice(0, 10); // Limit to 10 results

        if (foundCenters.length > 0) {
          setCenters(foundCenters);
          toast({
            title: "Centers Found!",
            description: `Found ${foundCenters.length} recycling centers near you`,
          });
        } else {
          setCenters([]);
          toast({
            title: "No Centers Found",
            description: "Try expanding your search area or check nearby cities",
            variant: "destructive",
          });
        }
      } else {
        setCenters([]);
        toast({
          title: "No Centers Found",
          description: "No recycling centers found in your area. Try a different location.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error searching recycling centers:', error);
      toast({
        title: "Search Error",
        description: "Failed to search for recycling centers. Please try again.",
        variant: "destructive",
      });
      setCenters([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async () => {
    if (!location.trim()) {
      toast({
        title: "Location Required",
        description: "Please enter a location to search",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    const coords = await geocodeAddress(location);
    
    if (coords) {
      setUserCoords(coords);
      await searchRecyclingCenters(coords);
    } else {
      toast({
        title: "Location Not Found",
        description: "Could not find the specified location. Please try a different address.",
        variant: "destructive",
      });
      setIsSearching(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setIsSearching(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          setLocation(`${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)}`);
          setUserCoords(coords);
          await searchRecyclingCenters(coords);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location Error",
            description: "Could not get your location. Please enter it manually.",
            variant: "destructive",
          });
          setIsSearching(false);
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation. Please enter your location manually.",
        variant: "destructive",
      });
    }
  };

  const openInMaps = (center: RecyclingCenter) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lon}`;
    window.open(url, '_blank');
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 flex-1"
                      onClick={() => openInMaps(center)}
                    >
                      <Navigation className="w-4 h-4" />
                      Get Directions
                    </Button>
                    {center.website && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 flex-1"
                        onClick={() => window.open(center.website, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Website
                      </Button>
                    )}
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
          <p className="text-muted-foreground mb-4">
            Enter your location to find real e-waste collection centers nearby
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="w-4 h-4" />
            <span>Powered by OpenStreetMap data</span>
          </div>
        </Card>
      )}

      {isSearching && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Searching...</h3>
              <p className="text-muted-foreground">
                Finding recycling centers in your area
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

