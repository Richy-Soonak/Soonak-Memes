"use client";
import jwt from "jsonwebtoken";
import bs58 from "bs58";
import React from "react";
import axios from "axios";
import useNotification from "@/hooks/useNotification";
import { TMsg } from "@/types/user";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { IUSER, TRegister } from "@/types";
import { isAuthenticatedAtom, userAtom } from "@/store/user";

interface IContext {
  signIn: () => Promise<void>;
  signUp: (data: TRegister) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  user: IUSER | undefined;
}

export const AuthContext = React.createContext<IContext | undefined>(undefined);

const AuthProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  //hooks
  const { showNotification } = useNotification();
  const router = useRouter();
  //atoms
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [isAuthenticating, setIsAuthenticating] =
    React.useState<boolean>(false);
  const [user, setUser] = useAtom(userAtom);

  const { publicKey, connected, signMessage, disconnect } = useWallet();

  const _setAuth = (user: IUSER | undefined, token: string | undefined) => {
    axios.defaults.headers.common["x-auth-token"] = token;
    if (token) {
      localStorage.setItem("accessToken-", token);
    } else {
      localStorage.removeItem("accessToken-");
      router.push("/");
    }
    setIsAuthenticated(token ? true : false);
    setUser(user);
  };

  /**
   * signin with SIWE
   * @returns
   */
  const signIn = async () => {
    try {
      if (!connected) throw "wallet is not connected...";
      if (!publicKey) throw "address is not defined...";
      if (!signMessage) throw "signMessage is not defined";
      setIsAuthenticating(true);
      const address = publicKey.toBase58();

      const { data: challenge } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/user/request-message`,
        {
          network: "mainnet",
          address,
        }
      );

      const { id, message, profileId, user }: TMsg = challenge;

      if (!id || !message || !profileId) {
        showNotification("Undefined Message.", "warning");
        return;
      }

      if (!user) {
        router.push("/register");
        showNotification("Please create your profile.", "warning");
        return;
      }

      const encodedMessage = new TextEncoder().encode(challenge?.message);

      if (!encodedMessage) {
        throw new Error("Failed to get encoded message.");
      }
      const signedMessage = await signMessage?.(encodedMessage);
      const signature = bs58.encode(signedMessage as Uint8Array);

      const { data: signData } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/user/signin`,
        {
          message,
          signature,
        }
      );

      if (signData === "none") {
        router.push("/register");
        showNotification("Please create your profile.", "warning");
      } else {
        const { data: _user }: any = jwt.decode(signData);
        _setAuth(_user, signData);
        showNotification("Signin Success", "success");
      }
    } catch (err: any) {
      if (err.code === 4001) {
        showNotification("User rejected the request.", "warning");
      } else if (err.code === "ERR_BAD_RESPONSE") {
        showNotification("Signin failed. Please try again.", "warning");
      }
    } finally {
      setIsAuthenticating(false);
    }
  };
  /**
   * user registration
   * @param data
   * @returns
   */
  const signUp = async (data: TRegister) => {
    try {
      if (!connected) throw "wallet is not connected...";
      if (!publicKey) throw "address is not defined...";

      const address = publicKey.toBase58();

      const { data: challenge } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/user/request-message`,
        {
          network: "mainnet",
          address,
        }
      );
      const { id, message, profileId, user }: TMsg = challenge;

      if (!id || !message || !profileId) {
        showNotification("Undefined Message.", "warning");
        return;
      }

      if (user) {
        showNotification("User already exists.", "warning");
        return;
      }

      const encodedMessage = new TextEncoder().encode(challenge?.message);

      if (!encodedMessage) {
        throw new Error("Failed to get encoded message.");
      }
      const signedMessage = await signMessage?.(encodedMessage);
      const signature = bs58.encode(signedMessage as Uint8Array);

      const { data: registerData } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/user/signup`,
        {
          message,
          signature,
          user: data,
        }
      );

      if (registerData === "exists") {
        showNotification("User already exists.", "warning");
      } else {
        const { data: _user }: any = jwt.decode(registerData);
        _setAuth(_user, registerData);
        showNotification("Profile created Successfully.", "success");
      }
    } catch (err: any) {
      console.log(err);
      if (err.code === 4001) {
        showNotification("User rejected the request.", "warning");
      } else if (
        err.code === "ERR_BAD_RESPONSE" ||
        err.code === "ERR_NETWORK"
      ) {
        showNotification("Register failed. Please try again.", "warning");
      }

      throw "failed";
    }
  };

  /**
   * sign with token
   * @param token
   */
  const signWithJWT = async (token: string) => {
    try {
      setIsAuthenticating(true);
      axios.defaults.headers.common["x-auth-token"] = token;
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/user/signinWithToken`
      );
      if (data === "none") {
        throw "none user";
      } else {
        const { data: _user }: any = jwt.decode(data);
        _setAuth(_user, data);
      }
    } catch (err) {
      _setAuth(undefined, undefined);
      console.log(err);
    } finally {
      setIsAuthenticating(false);
    }
  };

  //@ when wallet is connected, signin with SIWE
  React.useEffect(() => {
    if (connected && typeof window !== "undefined") {
      const jwt = window.localStorage.getItem("accessToken-");
      if (jwt) {
        signWithJWT(jwt);
      } else {
        signIn();
      }
    } else {
      setUser(undefined);
      setIsAuthenticated(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, publicKey]);

  //@ disconnect
  // React.useEffect(() => {
  //   if (isDisconnected && user && isAuthenticated) {
  //     _setAuth(undefined, undefined);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isDisconnected]);

  const signOut = async () => {
    try {
      disconnect();
      _setAuth(undefined, undefined);
    } catch (err) { }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signUp,
        signOut,
        isAuthenticated,
        isAuthenticating,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
