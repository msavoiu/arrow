"use client"

import React, { useState, useEffect } from "react";
import isAuth from "../components/isAuth";

type ProfileData = {
    id: number;
    displayName: string;
    bio: string;
    userId: number;
    user: { id: number; username: string };
    tags: { id: number; tag: { id: number; tagName: string } }[];
  };

function Matches({ userId }: { userId: number }) {
  const [matches, setMatches] = useState<ProfileData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await fetch(
                    "/api/match",
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
                    setMatches(res.data);
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

    const profileCards = matches!.map(match =>
        <>
            <h2>{match.displayName}</h2>
            <h3>@{match.user.username}</h3>
            <p>{match.bio}</p>

            <ul>
                {match.tags.map((tagObj => (
                    <li>{tagObj.tag.tagName}</li>
                )))}
            </ul>
        </>
    );

    return (
        <>
            <h1>Matches</h1> 
            {profileCards}
        </>
    );
};

export default isAuth(Matches); // protected route wrapper
