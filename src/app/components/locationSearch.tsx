"use client"

import React, { useState, useRef } from "react";
import { useJsApiLoader, StandaloneSearchBox } from "@react-google-maps/api";

type LocationData = {
    address: string;
    lat: number;
    lng: number;
};

type LocationSearchProps = {
    onLocationSelect: (location: LocationData | null) => void;
};

export default function LocationSearch() {
    const [location, setLocation] = useState<LocationData | null>(null);
    const inputRef = useRef<google.maps.places.SearchBox | null>(null);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        libraries: ["places"]
    })

    const handleOnPlacesChanged = () => {
        const places = inputRef.current?.getPlaces();
        // console.log("places:", places)

        const place = places![0]
        // console.log("place:", place)

        const newLocation = {
            address: place.formatted_address || "",
            lat: place.geometry?.location?.lat() || 0,
            lng: place.geometry?.location?.lng() || 0
        };

        setLocation(newLocation);
        console.log("newLocation:", newLocation);
    }

    return (
        <>
            { isLoaded &&
                <StandaloneSearchBox 
                    onLoad={(ref) => inputRef.current = ref}
                    onPlacesChanged={handleOnPlacesChanged}>
                    <input
                        type="text"
                        placeholder="Enter location"/>
                </StandaloneSearchBox>
            }
        </>
    );

}
