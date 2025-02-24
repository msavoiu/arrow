"use client"

import React, { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { error } from "console";
import { IconPlayerStopFilled } from "@tabler/icons-react";

interface ProfileData {
    username: string;
    displayName: string;
    bio: string;
    tags: string[]; // array of strings!
}

export default function LoginForm() {
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await fetch(
                    "/api/profile/view",
                    {
                        method: "GET",
                        headers: {
                            "Content-type": "application/json"
                        },
                        credentials: "include", // need to send the JWT!
                    }
                );
                const res = await response.json();

                if (!res.ok) {
                    setHasError(true);
                } else {
                    setProfileData(res.data);
                }
            } catch (error) {
                setHasError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    if (isLoading) return <p>Loading...</p>;
    if (hasError) return <p>An error has occurred. Please try again later.</p>

    const tagList = profileData!.tags.map(tag => <li>{tag}</li>);

    return (
        <>
            <h1>{profileData!.displayName}</h1> 
            <p>@{profileData!.username}</p>
            <p>{profileData!.bio}</p>

            <ol>{tagList}</ol>
            {/* type assertion with ! tells the compiler that profileData will not be null */}
        </>
    );
};
