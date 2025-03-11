// src/context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from 'react';

// Define the shape of the context
interface AuthContextType {
  token: string | null;
  login: (jwtToken: string) => void;
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

  // Load the token from localStorage when the app starts
  useEffect(() => {
    const savedToken = localStorage.getItem('jwtToken');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // Save the token in localStorage and update state
  const login = (jwtToken: string) => {
    localStorage.setItem('jwtToken', jwtToken);
    setToken(jwtToken);
  };

  // Clear the token from localStorage and update state
  const logout = () => {
    localStorage.removeItem('jwtToken');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
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
