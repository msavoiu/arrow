"use client"

import React, { useState } from "react";
import { redirect } from "next/navigation";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
//   const submitLoginForm = async e => {
//     e.preventDefault();
//     try {
//       const res = await fetch(
//         "http://127.0.0.1:3000/api/login",
//         {
//           method: "POST",
//           headers: {
//             "Content-type": "application/json"
//           },
//           body: JSON.stringify({ username, password }), // Send info from form as a JSON
//           credentials: "include",
//         }
//       );

//       const response = await res.json();
  
//       // Successful login
//       if (response.ok) {
//         alert("Login succsesful. Redirecting you to your profile.");
//         window.location = response.redirect; // use react link instead
//       } else {
//         alert(response.message);
//       }

//     } catch (error: any) {
//       console.error(error.message);
//       alert("An error occured. Please try again later.");
//     }
//   };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault;
    try {
        const res = await fetch(
            "/api/login",
            {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ username, password }), // Send info from form as a JSON
                credentials: "include",
            }
        );

        const response = await res.json();

        if (response.ok) {
            alert("Login succsesful. Redirecting you to your profile.");
            // What's the best way to redirect with Next.js?
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
