"use client"

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export default function isAuth(Component: any) {
    return function IsAuth(props: any) {
        const [userId, setUserId] = useState<number | null>(null);
        const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
        const [isLoading, setIsLoading] = useState<boolean>(true);

        useEffect(() => {
            async function checkAuth() {
                const res = await fetch("/api/auth", {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json"
                    },
                    credentials: "include"
                });

                const response = await res.json();
                const auth: boolean = response.ok;
                const userId: number = response.userId;

                if (auth) {
                    setIsAuthenticated(true);
                    setUserId(userId);
                } else {
                    setIsAuthenticated(false);
                }
            
                setIsLoading(false);
            }

            checkAuth();
        }, []);

        if (isLoading) {
            return <p>Loading...</p>;
        }

        if (!isAuthenticated) {
            // without this check the protected route will still load but not have the necessary info (userId) to render
            redirect("/login");
        }

        return <Component {...props} userId={userId} />;
    };
}
