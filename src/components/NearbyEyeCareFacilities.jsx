import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { toast } from "react-toastify";

const hospitalIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
});

const clinicIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [32, 32],
});

const NearbyEyeCareFacilities = () => {
  const [location, setLocation] = useState(null);
  const [eyeCareFacilities, setEyeCareFacilities] = useState([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);
  const [errorFacilities, setErrorFacilities] = useState("");

  // Fetch user's location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setErrorFacilities("Geolocation is not supported by your browser.");
      toast.error("Geolocation is not supported.");
      return;
    }

    setLoadingFacilities(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        setErrorFacilities(
          "Failed to get location. Please allow location access."
        );
        toast.error("Failed to get location: " + err.message);
        setLoadingFacilities(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Fetch nearby eye care facilities using Overpass API
  const fetchNearbyEyeCare = async (lat, lng) => {
    try {
      const query = `
        [out:json][timeout:25];
        (
          node["healthcare:speciality"="ophthalmology"](around:10000,${lat},${lng});
          node["healthcare"="optometrist"](around:10000,${lat},${lng});
          node["amenity"="clinic"]["healthcare"="yes"](around:10000,${lat},${lng});
          node["amenity"="hospital"]["healthcare"="yes"](around:10000,${lat},${lng});
        );
        out center;
      `;

      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: query,
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();

      if (data.elements && data.elements.length > 0) {
        const facilities = data.elements.map((element) => ({
          id: element.id,
          name: element.tags.name || "Unnamed Eye Care Facility",
          lat: element.lat || element.center.lat,
          lon: element.lon || element.center.lon,
          type: element.tags.amenity,
          address:
            element.tags["addr:full"] ||
            element.tags["addr:street"] ||
            "Address not specified",
          specialty: element.tags["healthcare:speciality"] || "General",
        }));
        setEyeCareFacilities(facilities);
      } else {
        setErrorFacilities("No eye care facilities found within 10km.");
        toast.warn("No eye care centers found nearby.");
      }
    } catch (err) {
      setErrorFacilities("Failed to fetch facilities: " + err.message);
      toast.error("Failed to fetch facilities: " + err.message);
    } finally {
      setLoadingFacilities(false);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetchNearbyEyeCare(location.lat, location.lng);
    }
  }, [location]);

  return (
    <div className="mt-10 w-full max-w-5xl pb-25 z-0">
      <h2 className="text-2xl font-semibold text-[#b3d1d6] mb-6 flex items-center gap-2">
        Nearby Eye Care Facilities
      </h2>

      {loadingFacilities && (
        <p className="text-center text-[#b3d1d6]/70">Loading facilities...</p>
      )}
      {errorFacilities && (
        <p className="text-red-400 text-center mb-6">{errorFacilities}</p>
      )}

      {location && (
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={12}
          className="h-96 w-full rounded-lg"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[location.lat, location.lng]}>
            <Popup>Your Location</Popup>
          </Marker>
          {eyeCareFacilities.map((facility) => (
            <Marker
              key={facility.id}
              position={[facility.lat, facility.lon]}
              icon={facility.type === "hospital" ? hospitalIcon : clinicIcon}
            >
              <Popup>
                <strong>{facility.name}</strong>
                <br /> {facility.address}
                <br /> Type:{" "}
                {facility.type === "hospital" ? "Hospital" : "Clinic"}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default NearbyEyeCareFacilities;
