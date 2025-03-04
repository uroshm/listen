import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface AuthResponse {
  token: string;
}

interface DecodedToken {
  exp: number;
}

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

export const fetchToken = async (): Promise<string | null> => {
  // Check if the token cookie already exists
  const existingToken = Cookies.get('token');
  console.log('existingToken: ' + existingToken);
  if (existingToken && !isTokenExpired(existingToken)) {
    return existingToken;
  }

  try {
    const response = await axios.post<AuthResponse>(
      'http://localhost:8080/auth/login',
      {
        username: 'user',
        password: 'password123',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status !== 200) {
      throw new Error('Failed to authenticate');
    }

    const { token } = response.data;
    // Set the token as a cookie
    Cookies.set('token', token, { expires: 1 }); // Expires in 1 day
    return token;
  } catch (error) {
    console.error('Error fetching token:', error);
    return null;
  }
};
