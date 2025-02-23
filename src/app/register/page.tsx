"use client"

import React, { useState } from "react";
import { redirect } from "next/navigation";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
        const res = await fetch(
            "/api/register", // don't need absolute url since it's on the same server
            {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(
                  { 
                    username, 
                    password
                  }
                ), // Send info from form as a JSON
                credentials: "include",
            }
        );

        const response = await res.json();

        if (response.ok) {
            alert(response.message);
            redirect(response.redirect); // should redirect to onboarding page so user can set up their profile
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
      <h1>Register</h1>
      <form onSubmit={onSubmit}>
        <input type="text"
               placeholder="Username"
               value={username}
               onChange={e => setUsername(e.target.value)}
               required/>
        <input type="password"
               placeholder="Password"
               value={password}
               onChange={e => setPassword(e.target.value)}
               required/>
        <button type="submit">Register</button>
      </form>
    </>
  );
}
