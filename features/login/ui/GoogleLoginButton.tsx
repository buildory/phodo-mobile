import React, { useEffect } from "react";
import { GoogleSignin, GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { useGoogleLogin } from "../model/useGoogleLogin";

export const GoogleLoginButton = () => {
  const webClientId = process.env.EXPO_PUBLIC_WEBCLIENT_ID!
  const { loginWithGoogle } = useGoogleLogin();

  useEffect(() => {
    GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/userinfo.email'],
        webClientId: webClientId,
    });
  }, []);

  return (
    <GoogleSigninButton
      style={{width: '100%', marginTop: 30}}
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={loginWithGoogle}
    />
  );
};
