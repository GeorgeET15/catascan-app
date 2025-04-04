import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import red_hospital from "../assets/red_hospital.png";
import blue_hospital from "../assets/blue_hospital.png";
import my_loc from "../assets/image.png";

// Custom User Icon (Green-tinted marker)
const userIcon = new L.Icon({
  iconUrl: my_loc,
  iconSize: [32, 32],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Custom Hospital Icon (Red hospital symbol from Flaticon)
const hospitalIcon = new L.Icon({
  iconUrl: red_hospital,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Custom Clinic Icon (Blue eye symbol from Flaticon)
const clinicIcon = new L.Icon({
  iconUrl: blue_hospital,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
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
      return;
    }

    if (
      window.location.protocol !== "https:" &&
      window.location.hostname !== "localhost"
    ) {
      setErrorFacilities("Geolocation requires a secure connection (HTTPS).");
      return;
    }

    setLoadingFacilities(true);
    setErrorFacilities("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoadingFacilities(false);
      },
      (err) => {
        let errorMessage = "Failed to get location. ";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage +=
              "Please allow location access in your browser settings.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable.";
            break;
          case err.TIMEOUT:
            errorMessage += "The request timed out. Try again.";
            break;
          default:
            errorMessage += err.message;
        }
        setErrorFacilities(errorMessage);
        setLoadingFacilities(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
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
      }
    } catch (err) {
      setErrorFacilities("Failed to fetch facilities: " + err.message);
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
        <MapPin size={24} /> Nearby Eye Care Facilities
      </h2>

      {loadingFacilities && (
        <p className="text-center text-[#b3d1d6]/70">Loading facilities...</p>
      )}
      {errorFacilities && (
        <div className="text-center mb-6">
          <p className="text-red-400">{errorFacilities}</p>
          <button
            onClick={getUserLocation}
            className="mt-4 bg-[#b3d1d6] text-[#0d2a34] py-2 px-4 rounded-xl font-semibold hover:bg-[#a1c3c8] transition-colors"
          >
            Retry Location Fetch
          </button>
        </div>
      )}

      {location && !errorFacilities && (
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={12}
          className="h-96 w-full rounded-lg"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[location.lat, location.lng]} icon={userIcon}>
            <Popup>
              <strong>You are here</strong>
              <br />
              Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
            </Popup>
          </Marker>
          {eyeCareFacilities.map((facility) => (
            <Marker
              key={facility.id}
              position={[facility.lat, facility.lon]}
              icon={facility.type === "hospital" ? hospitalIcon : clinicIcon}
            >
              <Popup>
                <div className="flex flex-col gap-2">
                  <strong>{facility.name}</strong>
                  <span>{facility.address}</span>
                  <span>
                    Type: {facility.type === "hospital" ? "Hospital" : "Clinic"}
                  </span>
                  <button
                    onClick={() => {
                      // Encode the facility name to handle special characters
                      const encodedName = encodeURIComponent(facility.name);
                      // Optional: Include address for more precise results
                      const query =
                        facility.address !== "Address not specified"
                          ? `${encodedName}, ${encodeURIComponent(
                              facility.address
                            )}`
                          : encodedName;
                      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
                      window.open(googleMapsUrl, "_blank");
                    }}
                    className="mt-2 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors"
                  >
                    Go Here
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      {/* CSS to tint the user icon green */}
      <style>
        {`
          .user-icon {
            filter: hue-rotate(120deg); /* Green tint */
          }
          .custom-user-icon {
            background: none; /* Remove default Leaflet divIcon background */
            border: none;
          }
        `}
      </style>
    </div>
  );
};

export default NearbyEyeCareFacilities;
