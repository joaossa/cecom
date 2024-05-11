import { createContext, useContext, useState } from "react";
import { IAuthContext } from "../interfaces/Auth/IAuthContext";

const AuthContext = createContext<IAuthContext>(undefined!);

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [isVerifyEmail, setIsVerifyEmail] = useState(false);

  let isAuthenticated = false;

  function logout() {}
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        logout,
        setLoading,
        setIsVerifyEmail,
        isVerifyEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
