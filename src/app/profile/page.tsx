"use client"

import React, { useState, useEffect } from "react";
import isAuth from "../components/isAuth";

interface ProfileData {
    username: string;
    displayName: string;
    bio: string;
    tags: string[]; // array of strings!
}

function Profile({ userId }: { userId: number }) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await fetch(
                    "/api/profile/view",
                    {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify({ userId }), // prop from the protected component route
                        credentials: "include"
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

export default isAuth(Profile); // protected route wrapper
