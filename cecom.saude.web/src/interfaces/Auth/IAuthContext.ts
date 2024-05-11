import React from "react";

export interface IAuthContext {
  isAuthenticated: boolean;
  logout: () => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsVerifyEmail: React.Dispatch<React.SetStateAction<boolean>>;
  isVerifyEmail: boolean;
}
