"use client"

import React, { useState } from "react";
import isAuth from "@/app/components/isAuth";

function UpdateProfile({ userId }: { userId: number }) {
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            if (displayName) {
                const dnameRes = await fetch(
                    "/api/profile/update/displayname",
                    {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify({
                            userId,
                            displayName
                        }),
                        credentials: "include",
                    }
                );
    
                const dnameResponse = await dnameRes.json();
    
                if (!dnameResponse.ok) {
                    alert(dnameResponse.message);
                }
            }

            if (bio) {
                const bioRes = await fetch(
                    "/api/profile/update/bio",
                    {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify({
                                userId,
                                bio
                        }),
                        credentials: "include",
                    }
                );
    
                const bioResponse = await bioRes.json();
    
                if (!bioResponse.ok) {
                    alert(bioResponse.message);
                }
            }

            alert("Profile updated.");

        } catch (error: any) {
            console.error(error.message);
            alert("An error occured. Please try again later.");
        }
    };

    return (
        <>
            <h1>Update Profile</h1>

            <form onSubmit={onSubmit}>
                <input type="text"
                    placeholder="Display name"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}/>
                <input type="text"
                    placeholder="Bio"
                    value={bio}
                    onChange={e => setBio(e.target.value)}/>
                <button type="submit">Update</button>
            </form>
        </>
  );
}

export default isAuth(UpdateProfile)
