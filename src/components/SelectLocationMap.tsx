
import React, { useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    let isMounted = true;
    if (apiToken && mapRef.current && (window as any).mapboxgl) {
      (async () => {
        // Init map
        const mapboxgl = (window as any).mapboxgl;
        mapboxgl.accessToken = apiToken;
        mapboxRef.current = new mapboxgl.Map({
          container: mapRef.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [coords.lng, coords.lat],
          zoom: 14
        });
        // Add marker
        markerRef.current = new mapboxgl.Marker({ draggable: true })
          .setLngLat([coords.lng, coords.lat])
          .addTo(mapboxRef.current);

        markerRef.current.on('dragend', () => {
          const {lat, lng} = markerRef.current.getLngLat();
          setCoords({ lat, lng });
        });

        mapboxRef.current.on('click', (e: any) => {
          setCoords({ lat: e.lngLat.lat, lng: e.lngLat.lng });
          markerRef.current.setLngLat(e.lngLat);
        });

        setLoading(false);

        // Clean up
        return () => {
          if (mapboxRef.current) mapboxRef.current.remove();
        };
      })();
    }
    return () => { isMounted = false };
    // eslint-disable-next-line
  }, [apiToken]);

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
    navigator.geolocation?.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    );
  }, []);

  // Save token after entry
  const handleSetToken = () => {
    localStorage.setItem("mapboxToken", apiToken);
    setLoading(false);
  };

  const handleConfirm = async () => {
    if (!apiToken) return;
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lng}`
      );
      const data = await resp.json();
      onSelect(data.address || {});
      onClose();
    } catch (err: any) {
      setError("Failed to reverse geocode location.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-4 relative max-w-lg w-full">
        <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>×</button>
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
            <button className="mt-2 px-3 py-1 bg-primary text-white rounded" onClick={handleSetToken}>
              Save Token
            </button>
            <p className="text-xs mt-2 text-gray-600">Get your Mapbox public token from mapbox.com account dashboard.</p>
          </div>
        )}
        {apiToken && (
          <div className="w-full h-72 rounded mb-3" ref={mapRef} />
        )}
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <div className="flex justify-end gap-2">
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={onClose}>Cancel</button>
          <button
            className="px-3 py-1 bg-primary text-white rounded"
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
