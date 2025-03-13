"use client";

import React, { useState } from "react";
import isAuth from "@/app/components/isAuth";
import LocationSearch from "@/app/components/locationSearch";

function UpdateProfile({ userId }: { userId: number }) {
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState<{ address: string; lat: number; lng: number } | null>(null);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            if (displayName) {
                await fetch("/api/profile/update/displayname", {
                    method: "POST",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify({ userId, displayName }),
                    credentials: "include",
                });
            }

            if (bio) {
                await fetch("/api/profile/update/bio", {
                    method: "POST",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify({ userId, bio }),
                    credentials: "include",
                });
            }

            if (location) {
                await fetch("/api/profile/update/location", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId,
                        address: location.address,
                        lat: location.lat,
                        lng: location.lng,
                    }),
                    credentials: "include",
                });
            }

            alert("Profile updated.");

        } catch (error: any) {
            console.error(error.message);
            alert("An error occurred. Please try again later.");
        }
    };

    return (
        <>
            <h1>Update Profile</h1>

            <form onSubmit={onSubmit}>
                <input 
                    type="text"
                    placeholder="Display name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                />
                <input 
                    type="text"
                    placeholder="Bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Search for your location"
                    disabled
                />
                <p>Notice: Google Places API is currently experiencing some issues. Location updating for users is temporarily disabled.</p>

                <button type="submit">Update</button>
            </form>
        </>
    );
}

export default isAuth(UpdateProfile);
