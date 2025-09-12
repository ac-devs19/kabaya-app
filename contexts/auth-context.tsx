import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "@/api/axios";
import { router } from "expo-router";
import { Alert } from "react-native";
import { useLoader } from "@/contexts/loader-context";
import { setToken } from "@/services/auth-storage";

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
  is_verified: boolean;
  role: string;
  email: string;
}

interface loginData {
  email: string;
  password: string;
}

interface forgotPasswordData {
  email: string;
}

interface resetPasswordData {
  password: string;
  password_confirmation: string;
  email: string;
}

interface createAccountData {
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix?: string;
  email: string;
}

interface verifyOtpData {
  otp: string;
  email: string;
}

interface createPasswordData {
  password: string;
  password_confirmation: string;
  email: string;
}

interface changePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  email: string;
  isForgotPassword: boolean;
  login: (data: loginData) => Promise<void>;
  forgotPassword: (data: forgotPasswordData) => Promise<void>;
  resetPassword: (data: resetPasswordData) => Promise<void>;
  createAccount: (data: createAccountData) => Promise<void>;
  verifyOtp: (data: verifyOtpData) => Promise<void>;
  resendOtp: () => Promise<void>;
  createPassword: (data: createPasswordData) => Promise<void>;
  changePassword: (data: changePasswordData) => Promise<void>;
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

  const login = async (data: loginData) => {
    setLoader(true);
    try {
      const response = await axios.post("/login", data);
      await setToken(response.data.token);
      await getUser();
    } catch (error: any) {
      Alert.alert("Error!", error.response.data.message);
    } finally {
      setLoader(false);
    }
  };

  const forgotPassword = async (data: forgotPasswordData) => {
    setLoader(true);
    try {
      await axios.post("/forgot-password", data);
      setIsForgotPassword(true);
      setEmail(data.email);
      router.push("/otp-verification");
    } catch (error: any) {
      if (error.response.status === 422) {
        Alert.alert("Error!", error.response.data.message);
      }
    } finally {
      setLoader(false);
    }
  };

  const resetPassword = async (data: resetPasswordData) => {
    setLoader(true);
    try {
      await axios.post("/reset-password", data);
      router.replace("/sign-in");
      setEmail("");
    } catch (error: any) {
      if (error.response.status === 422) {
        Alert.alert("Error!", error.response.data.message);
      }
    } finally {
      setLoader(false);
    }
  };

  const createAccount = async (data: createAccountData) => {
    setLoader(true);
    try {
      await axios.post("/create-account", data);
      setIsForgotPassword(false);
      setEmail(data.email);
      router.push("/otp-verification");
    } catch (error: any) {
      Alert.alert("Error!", error.response.data.message);
    } finally {
      setLoader(false);
    }
  };

  const verifyOtp = async (data: verifyOtpData) => {
    setLoader(true);
    try {
      await axios.post("/verify-otp", data);
      router.dismissAll();
      router.replace("/password");
    } catch (error: any) {
      if (error.response.status === 400) {
        Alert.alert("Error!", error.response.data.message);
      }
      if (error.response.status === 422) {
        Alert.alert("Error!", error.response.data.message);
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

  const createPassword = async (data: createPasswordData) => {
    setLoader(true);
    try {
      const response = await axios.post("/create-password", data);
      await setToken(response.data.token);
      await getUser();
      router.replace("/welcome");
      setEmail("");
    } catch (error: any) {
      if (error.response.status === 422) {
        Alert.alert("Error!", error.response.data.message);
      }
    } finally {
      setLoader(false);
    }
  };

  const changePassword = async (data: changePasswordData) => {
    setLoader(true);
    try {
      await axios.post("/change-password", data);
      router.back();
    } catch (error: any) {
      if (error.response.status === 422) {
        Alert.alert("Error!", error.response.data.message);
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
