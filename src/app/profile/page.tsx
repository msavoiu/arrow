"use client"

import Link from "next/link";
import React, { useState, useEffect } from "react";
import isAuth from "../components/isAuth";

interface ProfileData {
    username: string;
    displayName: string;
    bio: string;
    tags: string[];
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
            } catch (error: any) {
                setHasError(true);
                console.error(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [userId]);

    if (isLoading) return <p>Loading...</p>;
    if (hasError) return <p>An error has occurred. Please try again later.</p>

    const tagList = profileData!.tags.map((tag, index) => <li key={index}>{tag}</li>);

    return (
        <>
            <h1>{profileData!.displayName}</h1> 
            <p>@{profileData!.username}</p>
            <p>{profileData!.bio}</p>
            {/* type assertion with ! tells the compiler that profileData will not be null */}

            <ul>{tagList}</ul>
        
            <Link href="/profile/update">Edit Profile</Link>
        </>
    );
};

export default isAuth(Profile); // protected route wrapper
