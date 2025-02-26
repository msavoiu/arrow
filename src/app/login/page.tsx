"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const router = useRouter():
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const res = await fetch(
                "/api/login",
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
                    ),
                    credentials: "include",
                }
            );

            const response = await res.json();

            if (response.ok) {
                alert(response.message);
                // use router for client-side components
                router.push(response.redirect);
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
      <h1>Login</h1>
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
        <button type="submit">Login</button>
      </form>
    </>
  );
}
