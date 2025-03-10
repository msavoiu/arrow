"use client"

import React, { useRef } from "react";
import { useJsApiLoader, StandaloneSearchBox } from "@react-google-maps/api";

export default function LocationSearch() {
    const inputRef = useRef<google.maps.places.SearchBox | null>(null);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        libraries: ["places"]
    })

    const handleOnPlacesChanged = () => {
        let address = inputRef.current?.getPlaces();
        console.log("address:", address);
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
