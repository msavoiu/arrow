"use client"

import React, { useState, useEffect } from "react";
// import isAuth from "../components/isAuth";
import {
    APIProvider,
    Map,
    AdvancedMarker,
    MapCameraChangedEvent,
    Pin
} from "@vis.gl/react-google-maps";

type Poi = {
    userId: number, // user ID
    location: google.maps.LatLngLiteral
};

type LocationData = {
    userId: number;
    address: string;
    lat: number;
    lng: number;
  };

export default function MapPage() {
      const [markerData, setMarkerData] = useState<LocationData[] | null>(null);
      const [isLoading, setIsLoading] = useState(true);
      const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await fetch(
                    "/api/map/markers",
                    {
                        method: "GET",
                        headers: {
                            "Content-type": "application/json"
                        },
                        credentials: "include"
                    }
                );
                const res = await response.json();

                if (!res.ok) {
                    setHasError(true);
                } else {
                    setMarkerData(res.data);
                }
            } catch (error: any) {
                setHasError(true);
                console.log(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    if (isLoading) return <p>Loading...</p>;
    if (hasError) return <p>An error has occurred. Please try again later.</p>

    const locations: Poi[] = markerData!.map((loc) => ( // use parentheses to wrap around object literals
        { userId: loc.userId, location: { lat: loc.lat, lng: loc.lng } }
    ));

    return (
        <>
            <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY as string} onLoad={() => console.log('Maps API has loaded.')}>
                <Map
                    defaultZoom={13}
                    defaultCenter={ { lat: -33.860664, lng: 151.208138 } }
                    mapId={process.env.NEXT_PUBLIC_MAP_ID}
                    style={{ width: "100%", height: "500px" }}
                    onCameraChanged={ (ev: MapCameraChangedEvent) =>
                        console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                    }>
                        <PoiMarkers pois={locations}/>
                </Map> 
            </APIProvider>
        </>
    );
};

const PoiMarkers = (props: {pois: Poi[]}) => {
    return (
      <>
        {props.pois.map( (poi: Poi) => (
          <AdvancedMarker
            key={poi.userId}
            position={poi.location}>
          <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
          </AdvancedMarker>
        ))}
      </>
    );
  };
