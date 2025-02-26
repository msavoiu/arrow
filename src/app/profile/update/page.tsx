"use client"

import React, { useState } from "react";
import { redirect } from "next/navigation";
import isAuth from "../../components/isAuth"; // how to get absolute path with @?

function UpdateProfile({ userId }: { userId: number }) {
  const [displayName, setDisplayName] = useState("");

  const onSubmitDisplayName = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
        const res = await fetch(
            "/api/profile/update/displayname",
            {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(
                  {
                    userId,
                    displayName
                  }
                  ),
                credentials: "include",
            }
        );

        const response = await res.json();

        if (response.ok) {
            alert(response.message);
            redirect(response.redirect);
        } else {
            alert(response.message);
        }

    } catch (error: any) {
        console.error(error.message);
        alert("An error occured. Please try again later.");
    }
  };

  return (
    <>
        <h1>Update Profile</h1>
        <form onSubmit={onSubmitDisplayName}>
            <input type="text"
                placeholder="Display name"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                required/>
            <button type="submit">Update</button>
        </form>
    </>
  );
}

export default isAuth(UpdateProfile)