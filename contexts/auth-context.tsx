import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "@/api/axios";
import { router } from "expo-router";
import { useLoader } from "@/contexts/loader-context";
import { setToken } from "@/services/auth-storage";
import { useToast } from "@/components/toast";

interface User {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  sex: string;
  birth_date: Date;
  province: string;
  municipality: string;
  barangay: string;
  street_name: string;
  postal_code: string;
  phone_number: string;
  profile_picture: string;
  id_photo: string;
  selfie_id_photo: string;
  verification_status: string;
  is_verified: boolean;
  role: string;
  email: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  password: string;
  password_confirmation: string;
  email: string;
}

interface CreateAccountData {
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix?: string;
  email: string;
}

interface VerifyOtpData {
  otp: string;
  email: string;
}

interface CreatePasswordData {
  password: string;
  password_confirmation: string;
  email: string;
}

interface ChangePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  email: string;
  isForgotPassword: boolean;
  login: (data: LoginData) => Promise<void>;
  forgotPassword: (data: ForgotPasswordData) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  createAccount: (data: CreateAccountData) => Promise<void>;
  verifyOtp: (data: VerifyOtpData) => Promise<void>;
  resendOtp: () => Promise<void>;
  createPassword: (data: CreatePasswordData) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  logout: () => Promise<void>;
  getUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { setLoader } = useLoader();
  const { error } = useToast();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const { data } = await axios.get("/user");
      setUser(data);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    }
  };

  const login = async (data: LoginData) => {
    setLoader(true);
    try {
      const response = await axios.post("/login", data);
      await setToken(response.data.token);
      await getUser();
    } catch (err: any) {
      if (err.response.status === 422) {
        error("Error!", err.response.data.message);
      }
    } finally {
      setLoader(false);
    }
  };

  const forgotPassword = async (data: ForgotPasswordData) => {
    setLoader(true);
    try {
      await axios.post("/forgot-password", data);
      setIsForgotPassword(true);
      setEmail(data.email);
      router.push("/otp-verification");
    } catch (err: any) {
      if (err.response.status === 422) {
        error("Error!", err.response.data.message);
      }
    } finally {
      setLoader(false);
    }
  };

  const resetPassword = async (data: ResetPasswordData) => {
    setLoader(true);
    try {
      await axios.post("/reset-password", data);
      router.replace("/sign-in");
      setEmail("");
    } catch (err: any) {
      if (err.response.status === 422) {
        error("Error!", err.response.data.message);
      }
    } finally {
      setLoader(false);
    }
  };

  const createAccount = async (data: CreateAccountData) => {
    setLoader(true);
    try {
      await axios.post("/create-account", data);
      setIsForgotPassword(false);
      setEmail(data.email);
      router.push("/otp-verification");
    } catch (err: any) {
      if (err.response.status === 422) {
        error("Error!", err.response.data.message);
      }
    } finally {
      setLoader(false);
    }
  };

  const verifyOtp = async (data: VerifyOtpData) => {
    setLoader(true);
    try {
      await axios.post("/verify-otp", data);
      router.dismissAll();
      router.replace("/password");
    } catch (err: any) {
      if (err.response.status === 400) {
        error("Error!", err.response.data.message);
      }
      if (err.response.status === 422) {
        error("Error!", err.response.data.message);
      }
    } finally {
      setLoader(false);
    }
  };

  const resendOtp = async () => {
    setLoader(true);
    try {
      await axios.post("/resend-otp", { email });
    } finally {
      setLoader(false);
    }
  };

  const createPassword = async (data: CreatePasswordData) => {
    setLoader(true);
    try {
      const response = await axios.post("/create-password", data);
      await setToken(response.data.token);
      await getUser();
      router.replace("/welcome");
      setEmail("");
    } catch (err: any) {
      if (err.response.status === 422) {
        error("Error!", err.response.data.message);
      }
    } finally {
      setLoader(false);
    }
  };

  const changePassword = async (data: ChangePasswordData) => {
    setLoader(true);
    try {
      await axios.post("/change-password", data);
      router.back();
    } catch (err: any) {
      if (err.response.status === 422) {
        error("Error!", err.response.data.message);
      }
    } finally {
      setLoader(false);
    }
  };

  const logout = async () => {
    setLoader(true);
    try {
      await axios.get("/logout");
      await setToken(null);
      setUser(null);
    } finally {
      setLoader(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        email,
        isForgotPassword,
        login,
        forgotPassword,
        resetPassword,
        createAccount,
        verifyOtp,
        resendOtp,
        createPassword,
        changePassword,
        logout,
        getUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
