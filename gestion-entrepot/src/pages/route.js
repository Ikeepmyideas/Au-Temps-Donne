import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer } from '@react-google-maps/api';

const Route = ({ origin, destination }) => {
    const [directions, setDirections] = useState(null);

    const mapContainerStyle = {
        width: '100%',
        height: '90vh',
    };
    
    const center = {
        lat: (origin.lat + destination.lat) / 2,
        lng: (origin.lng + destination.lng) / 2,
    };

    useEffect(() => {
        const fetchDirections = () => {
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: origin,
                    destination: destination,
                    travelMode: 'DRIVING'
                },
                (result, status) => {
                    if (status === 'OK' && result) {
                        setDirections(result);
                    } else {
                        console.error(`Error fetching directions: ${status}`);
                    }
                }
            );
        };

        fetchDirections();
    }, [origin, destination]); // React hooks should handle the lifecycle and clean up more effectively.

    return (
        <LoadScript googleMapsApiKey="AIzaSyB3KofdS-3nitMbrTB0JVftrZXYU5WYxt4">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={7}
            >
                {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
        </LoadScript>
    );
};

export default Route;
