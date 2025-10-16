# API Documentation - Recycling Center Finder

## Overview

The Recycling Center Finder uses free, open-source APIs to provide real-time data about e-waste recycling centers worldwide.

## APIs Used

### 1. OpenStreetMap Nominatim API (Geocoding)

**Purpose:** Convert user-entered addresses into geographic coordinates (latitude/longitude)

**Endpoint:** `https://nominatim.openstreetmap.org/search`

**Request Format:**
```
GET https://nominatim.openstreetmap.org/search?format=json&q={address}&limit=1
Headers: {
  'User-Agent': 'SmartESort/1.0'
}
```

**Response Example:**
```json
[
  {
    "lat": "40.7128",
    "lon": "-74.0060",
    "display_name": "New York, NY, USA",
    ...
  }
]
```

**Usage Policy:**
- Free to use
- Requires User-Agent header
- Rate limit: ~1 request per second
- [Usage Policy](https://operations.osmfoundation.org/policies/nominatim/)

---

### 2. Overpass API (Location Data)

**Purpose:** Query OpenStreetMap database for recycling centers and waste disposal facilities

**Endpoint:** `https://overpass-api.de/api/interpreter`

**Request Format:**
```
POST https://overpass-api.de/api/interpreter
Body: Overpass QL query
```

**Query Used:**
```overpass
[out:json][timeout:25];
(
  node["amenity"="recycling"]["recycling_type"="centre"](around:25000,{lat},{lon});
  node["amenity"="waste_disposal"](around:25000,{lat},{lon});
  node["shop"="electronics"]["recycling"="yes"](around:25000,{lat},{lon});
  way["amenity"="recycling"]["recycling_type"="centre"](around:25000,{lat},{lon});
  way["amenity"="waste_disposal"](around:25000,{lat},{lon});
);
out center;
```

**What This Queries:**
1. **Recycling Centers** - Dedicated recycling facilities (nodes and ways)
2. **Waste Disposal Sites** - General waste management facilities
3. **Electronics Stores** - Stores that accept electronics for recycling

**Search Parameters:**
- **Radius:** 25,000 meters (25km)
- **Node Types:** Points and areas (ways) with center point
- **Timeout:** 25 seconds

**Response Example:**
```json
{
  "elements": [
    {
      "id": 123456,
      "lat": 40.7128,
      "lon": -74.0060,
      "tags": {
        "name": "City Recycling Center",
        "amenity": "recycling",
        "recycling_type": "centre",
        "addr:street": "Main St",
        "addr:housenumber": "100",
        "addr:city": "New York",
        "phone": "+1-555-0100",
        "opening_hours": "Mo-Sa 08:00-18:00",
        "recycling:batteries": "yes",
        "recycling:electrical_items": "yes",
        "website": "https://example.com"
      }
    },
    ...
  ]
}
```

**OpenStreetMap Tags Used:**

| Tag | Description | Example Values |
|-----|-------------|---------------|
| `amenity` | Type of facility | "recycling", "waste_disposal" |
| `recycling_type` | Recycling facility type | "centre", "container" |
| `name` | Facility name | "Green Recycling Center" |
| `operator` | Operating organization | "City Waste Management" |
| `addr:*` | Address components | street, housenumber, city |
| `phone` | Contact phone | "+1-555-0100" |
| `contact:phone` | Alternate phone field | "+1-555-0100" |
| `opening_hours` | Operating hours | "Mo-Sa 08:00-18:00" |
| `website` | Website URL | "https://example.com" |
| `recycling:batteries` | Accepts batteries | "yes" / "no" |
| `recycling:electrical_items` | Accepts electronics | "yes" / "no" |
| `recycling:computers` | Accepts computers | "yes" / "no" |
| `recycling:mobile_phones` | Accepts phones | "yes" / "no" |
| `recycling:small_appliances` | Accepts small appliances | "yes" / "no" |

**Usage Policy:**
- Free to use
- No API key required
- Rate limit: Reasonable usage
- [Usage Policy](https://overpass-api.de/)

---

## Data Processing

### Distance Calculation

**Haversine Formula Implementation:**
```typescript
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
```

**Accuracy:** Within 0.5% for most practical distances

---

## Error Handling

### Geocoding Errors
- **No results found:** User-friendly message to try a different location
- **Network error:** Retry suggestion with manual location entry option

### Search Errors
- **No centers found:** Suggests expanding search or trying nearby cities
- **API timeout:** Automatic retry or fallback message
- **Invalid response:** Error toast with support information

### Geolocation Errors
- **Permission denied:** Prompt for manual location entry
- **Position unavailable:** Fallback to address search
- **Timeout:** Option to retry or enter manually

---

## Performance Optimization

### Caching Strategy
Currently: No caching (always fresh data)

**Potential Improvements:**
1. Cache geocoding results for 24 hours
2. Cache recycling center data for 1 hour per location
3. Use localStorage for frequently searched locations

### Rate Limiting
- Nominatim: Max 1 request/second (automatic browser limitation)
- Overpass API: Batch requests when possible

---

## Data Quality

### Accuracy
- Depends on OpenStreetMap data quality in each region
- Data is community-maintained
- Generally excellent in urban areas
- May be sparse in rural regions

### Coverage
- **Best:** North America, Europe, Australia
- **Good:** Asia (major cities), South America
- **Variable:** Africa, rural areas worldwide

### Data Freshness
- Real-time queries to OpenStreetMap
- Data updated as OSM contributors make edits
- No stale data issues

---

## Alternative APIs (Future Options)

### Google Places API
**Pros:**
- Comprehensive data
- High accuracy
- Better coverage globally
- Includes reviews/ratings

**Cons:**
- Requires API key
- Costs money after free tier
- Rate limits

**Implementation:**
```typescript
// Example (not implemented)
const searchWithGoogle = async (location: string) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
    `location=${lat},${lon}&radius=25000&type=electronics_store&` +
    `keyword=recycling&key=${API_KEY}`
  );
  return response.json();
};
```

### Bing Maps API
**Pros:**
- Good global coverage
- Includes business details
- Generous free tier

**Cons:**
- Requires API key
- Documentation complexity

---

## Contributing to Data Quality

### How Users Can Help

**If a recycling center is missing:**
1. Visit [OpenStreetMap.org](https://www.openstreetmap.org/)
2. Create a free account
3. Add the recycling center:
   - Set `amenity=recycling`
   - Set `recycling_type=centre`
   - Add name, address, phone, hours
   - Add `recycling:electrical_items=yes`

**Improving existing data:**
- Update operating hours
- Add phone numbers
- Add accepted materials
- Add websites

This helps everyone using OSM-based services!

---

## API Response Times

**Typical Performance:**
- Geocoding: 200-500ms
- Overpass query: 1-3 seconds
- Total search time: 1.5-4 seconds

**Factors Affecting Speed:**
- User's internet connection
- API server load
- Search radius
- Number of results

---

## Privacy & Security

### User Data
- **No tracking:** We don't store user locations
- **No accounts:** No user data collected
- **No cookies:** For location services
- **HTTPS:** All API calls use encrypted connections

### API Keys
- **None required:** All APIs are free and open
- **No quotas:** For reasonable usage
- **No registration:** Start using immediately

---

## Troubleshooting

### Common Issues

**"No centers found"**
- Try a larger city name
- Use full address with city and state
- Try nearby major cities
- Check if location exists in OpenStreetMap

**"Location not found"**
- Verify spelling
- Include city/state/country
- Use common place names
- Try coordinates (lat, lon)

**"Geolocation error"**
- Allow location permissions in browser
- Check browser settings
- Use HTTPS (required for geolocation)
- Try manual address entry

**Slow responses**
- Normal for first search (API warmup)
- Check internet connection
- Overpass API may be under load
- Try again in a few moments

---

## Development Notes

### Testing
```bash
# Test geocoding
curl "https://nominatim.openstreetmap.org/search?format=json&q=New+York+City&limit=1"

# Test Overpass (save query to file first)
curl -X POST -d @query.txt https://overpass-api.de/api/interpreter
```

### Rate Limiting in Development
- Add delays between requests during testing
- Use mock data for rapid iteration
- Be respectful of free APIs

### Future Enhancements
1. Add map visualization (Leaflet.js)
2. Filter by accepted item types
3. Show photos of facilities
4. User reviews/ratings
5. Directions integration
6. Offline caching
7. Multiple language support

---

*Last Updated: October 2025*

