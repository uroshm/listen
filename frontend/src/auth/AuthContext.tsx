// src/context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useMemo,
} from 'react';

// Define the shape of the context
interface AuthContextType {
  token: string | null;
  username: string | null;
  login: (jwtToken: string, user: string) => void;
  logout: () => void;
}

// Create the AuthContext with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider props
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  // Load the token from localStorage when the app starts
  useEffect(() => {
    const savedToken = localStorage.getItem('jwtToken');
    const savedUsername = localStorage.getItem('username');
    if (savedToken) {
      setToken(savedToken);
    }
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  // Save the token and username in localStorage and update state
  const login = (jwtToken: string, user: string) => {
    localStorage.setItem('jwtToken', jwtToken);
    localStorage.setItem('username', user);
    setToken(jwtToken);
    setUsername(user);
  };

  // Clear the token and username from localStorage and update state
  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
  };

  const contextValue = useMemo(() => ({ token, username, login, logout }), [token, username, login, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
