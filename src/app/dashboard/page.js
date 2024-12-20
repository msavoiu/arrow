export default async function Dashboard() {
    const response = await fetch('/api/dashboard', {   
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    console.log(response);

    const data = await response.json();

    return (
        <h1>Hi {data.username}!</h1>
    );
}
