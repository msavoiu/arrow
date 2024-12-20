'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter(); // need this line for the push to actually work

  const logIn = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const responseData = await response.json(); // need to jsonify the response to get the actual data instead of just metadata about the response

    if (responseData.valid) {
        router.push('/dashboard');
    } else {
        // YOU CANNOT use .json() TO PARSE THE RESPONSE MORE THAN ONCE!
        // const errorMessage = await response.json();
        setErrorMessage(responseData.message);
    }
  };

  return (
    <div>
      <form onSubmit={logIn}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>} 
      {/* if errorMessage has a truthy value (i.e. it exists) then the paragraph tag will be displayed */}
    </div>
  );
}