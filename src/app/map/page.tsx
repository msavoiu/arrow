"use client"

import React, { useState, useEffect } from "react";
import isAuth from "../components/isAuth";
import {
    APIProvider,
    Map,
    AdvancedMarker,
    MapCameraChangedEvent,
    Pin
} from "@vis.gl/react-google-maps";

type Poi = {
    key: string, // user ID
    location: google.maps.LatLngLiteral
};

const locations: Poi[] = [
    { key: "CSUF", location: { lat: 33.88295284106687, lng: -117.88501752543223 }}
];

function MapPage({ userId }: { userId: number }) {
      const [markerData, setMarkerData] = useState<Poi | null>(null);
      const [isLoading, setIsLoading] = useState(true);
      const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await fetch(
                    "/api/location/get",
                    {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify({ userId }),
                        credentials: "include"
                    }
                );
                const res = await response.json();

                if (!res.ok) {
                    setHasError(true);
                } else {
                    setMarkerData(res.data);
                }
            } catch (error) {
                setHasError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    console.log(process.env.NEXT_PUBLIC_MAPS_API_KEY, process.env.NEXT_PUBLIC_MAP_ID);
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
            key={poi.key}
            position={poi.location}>
          <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
          </AdvancedMarker>
        ))}
      </>
    );
  };

export default isAuth(MapPage);
