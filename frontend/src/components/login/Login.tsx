// Import React and other necessary modules
import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

// Define the Login component
const Login: React.FC = () => {
  // State variables for username, password, error message, and authentication
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isRegistering ? '/auth/register' : '/auth/login';
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(isRegistering ? 'Registration failed' : 'Login failed');
      }

      if (isRegistering) {
        // After successful registration, switch to login mode
        setIsRegistering(false);
        setError('Registration successful! Please login.');
        setUsername('');
        setPassword('');
        return;
      }

      const jwtToken = await response.text();
      login(jwtToken, username);
      handleSuccess();
    } catch (error) {
      setError(
        `${isRegistering ? 'Registration' : 'Login'} failed. Please try again.`
      );
    }
  };

  const handleSuccess = () => {
    setUsername('');
    setPassword('');
    setError('');
    navigate('/home');
  };

  return (
    <div style={{ maxWidth: '300px', margin: '0 auto', padding: '20px' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '5px',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          {isRegistering ? 'Register' : 'Login'}
        </h2>

        {error && (
          <div
            style={{
              color: error.includes('successful') ? 'green' : 'red',
              marginBottom: '10px',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#007bff',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          {isRegistering ? 'Register' : 'Login'}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError('');
            setUsername('');
            setPassword('');
          }}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #007bff',
            backgroundColor: 'transparent',
            color: '#007bff',
            cursor: 'pointer',
          }}
        >
          {isRegistering ? 'Switch to Login' : 'Switch to Register'}
        </button>
      </form>
    </div>
  );
};

// Export the Login component
export default Login;
