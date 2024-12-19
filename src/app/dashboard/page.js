import dotenv from 'dotenv';
dotenv.config();

export default async function Dashboard() {
    const response = await fetch(`${process.env.URL}/api/dashboard`, {   
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const data = await response.json();

    return (
        <h1>Hi {data.username}!</h1>
    );
}
