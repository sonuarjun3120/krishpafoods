
import React, { useEffect, useRef, useState } from "react";
import { MapPin, Locate } from "lucide-react";

interface SelectLocationMapProps {
  onClose: () => void;
  onSelect: (data: { city?: string; state?: string; pincode?: string; country?: string; country_code?: string; }) => void;
}

const defaultCoords = { lat: 20.5937, lng: 78.9629 }; // Center of India

const SelectLocationMap: React.FC<SelectLocationMapProps> = ({ onClose, onSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapboxRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [apiToken, setApiToken] = useState(localStorage.getItem("mapboxToken") ?? "");
  const [error, setError] = useState("");
  const [coords, setCoords] = useState<{lat: number; lng: number;}>(defaultCoords);
  const [locationInfo, setLocationInfo] = useState<{
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  }>({});

  useEffect(() => {
    let isMounted = true;
    if (apiToken && mapRef.current && (window as any).mapboxgl) {
      (async () => {
        try {
          // Init map
          const mapboxgl = (window as any).mapboxgl;
          mapboxgl.accessToken = apiToken;
          mapboxRef.current = new mapboxgl.Map({
            container: mapRef.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [coords.lng, coords.lat],
            zoom: 14
          });
          
          // Add navigation controls
          mapboxRef.current.addControl(
            new mapboxgl.NavigationControl(),
            'top-right'
          );
          
          // Add marker
          markerRef.current = new mapboxgl.Marker({ 
            draggable: true,
            color: "#6366f1" // Match primary color
          })
            .setLngLat([coords.lng, coords.lat])
            .addTo(mapboxRef.current);

          markerRef.current.on('dragend', () => {
            const {lat, lng} = markerRef.current.getLngLat();
            setCoords({ lat, lng });
            fetchReverseGeocode(lat, lng);
          });

          mapboxRef.current.on('click', (e: any) => {
            setCoords({ lat: e.lngLat.lat, lng: e.lngLat.lng });
            markerRef.current.setLngLat(e.lngLat);
            fetchReverseGeocode(e.lngLat.lat, e.lngLat.lng);
          });

          // Fetch initial location data
          fetchReverseGeocode(coords.lat, coords.lng);

          if (isMounted) setLoading(false);
        } catch (err) {
          if (isMounted) {
            setError("Failed to initialize map. Please check your Mapbox token.");
            setLoading(false);
          }
        }

        // Clean up
        return () => {
          if (mapboxRef.current) mapboxRef.current.remove();
        };
      })();
    }
    return () => { isMounted = false };
    // eslint-disable-next-line
  }, [apiToken]);

  // Fetch location info from coordinates
  const fetchReverseGeocode = async (lat: number, lng: number) => {
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await resp.json();
      
      if (data.error) {
        setError("Couldn't find location details for this point.");
        return;
      }
      
      setLocationInfo({
        city: data.address?.city || data.address?.town || data.address?.village || "",
        state: data.address?.state || "",
        postcode: data.address?.postcode || "",
        country: data.address?.country || ""
      });
      setError("");
    } catch (err) {
      setError("Failed to retrieve location details.");
    }
  };

  // On mount: get geolocation, inject mapboxgl script if missing
  useEffect(() => {
    if (!(window as any).mapboxgl) {
      const script = document.createElement("script");
      script.src = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js";
      script.onload = () => setTimeout(() => setLoading(false), 500);
      document.body.appendChild(script);

      const link = document.createElement("link");
      link.href = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    
    // Try to get user location
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const newCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(newCoords);
        if (markerRef.current) {
          markerRef.current.setLngLat([newCoords.lng, newCoords.lat]);
        }
        fetchReverseGeocode(newCoords.lat, newCoords.lng);
      },
      () => {} // Silently fail - will use default location instead
    );
  }, []);

  // Save token after entry
  const handleSetToken = () => {
    if (!apiToken) {
      setError("Please enter a valid Mapbox token");
      return;
    }
    localStorage.setItem("mapboxToken", apiToken);
    setLoading(false);
    setError("");
  };

  const handleMyLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const newCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(newCoords);
        if (markerRef.current) {
          markerRef.current.setLngLat([newCoords.lng, newCoords.lat]);
        }
        if (mapboxRef.current) {
          mapboxRef.current.flyTo({
            center: [newCoords.lng, newCoords.lat],
            zoom: 15
          });
        }
        fetchReverseGeocode(newCoords.lat, newCoords.lng);
      },
      () => {
        setError("Could not access your location. Please check your browser permissions.");
      }
    );
  };

  const handleConfirm = () => {
    if (!apiToken) return;
    
    const addressData = {
      city: locationInfo.city,
      state: locationInfo.state,
      pincode: locationInfo.postcode,
      country: locationInfo.country,
    };
    
    onSelect(addressData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-4 relative max-w-lg w-full">
        <button 
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold" 
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-lg font-semibold mb-2">Choose Location</h2>
        
        {!apiToken && (
          <div className="mb-4">
            <label className="block text-sm mb-1 font-medium">Enter your Mapbox public token:</label>
            <input
              className="border px-2 py-1 rounded w-full"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              placeholder="pk.eyJ1..."
            />
            <button 
              className="mt-2 px-3 py-1 bg-primary text-white rounded hover:bg-primary/90" 
              onClick={handleSetToken}
            >
              Save Token
            </button>
            <p className="text-xs mt-2 text-gray-600">
              Get your Mapbox public token from <a href="https://www.mapbox.com/account/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com account dashboard</a>.
            </p>
          </div>
        )}
        
        {apiToken && (
          <>
            <div className="w-full h-72 rounded mb-3 relative" ref={mapRef}>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                </div>
              )}
              
              <button
                onClick={handleMyLocation}
                className="absolute bottom-3 right-3 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                title="Use my location"
              >
                <Locate className="w-5 h-5 text-primary" />
              </button>
            </div>
            
            {/* Location info display */}
            {Object.keys(locationInfo).length > 0 && (
              <div className="bg-gray-50 p-2 rounded mb-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    {locationInfo.city && <div><span className="font-medium">City:</span> {locationInfo.city}</div>}
                    {locationInfo.state && <div><span className="font-medium">State:</span> {locationInfo.state}</div>}
                    {locationInfo.postcode && <div><span className="font-medium">Postal Code:</span> {locationInfo.postcode}</div>}
                    {locationInfo.country && <div><span className="font-medium">Country:</span> {locationInfo.country}</div>}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        
        <div className="flex justify-end gap-2">
          <button 
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            onClick={handleConfirm}
            disabled={loading || !apiToken}
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectLocationMap;
