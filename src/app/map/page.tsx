"use client"

import React, { useState, useEffect } from "react";
import isAuth from "../components/isAuth";
import { APIProvider, Map, MapCameraChangedEvent } from "@vis.gl/react-google-maps";

function MapPage({ userId }: { userId: number }) {
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
                </Map> 
            </APIProvider>
        </>
    );
};

export default isAuth(MapPage);
