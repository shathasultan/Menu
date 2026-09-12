import { useEffect, useRef, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { useIdTokenAuthRequest } from 'expo-auth-session/providers/google';
import { GOOGLE_WEB_CLIENT_ID } from './config';
import { signInWithGoogleIdToken } from './authService';

WebBrowser.maybeCompleteAuthSession();

/**
 * Native (iOS/Android) Google sign-in additionally needs `iosClientId` /
 * `androidClientId` from Firebase once those platform apps are registered —
 * only the web client exists so far, so this currently only completes on web.
 */
export function useGoogleAuth() {
  const [request, response, promptAsync] = useIdTokenAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    clientId: GOOGLE_WEB_CLIENT_ID,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handledRef = useRef<string | null>(null);

  useEffect(() => {
    const idToken = response?.type === 'success' ? response.params.id_token : undefined;
    if (!idToken || handledRef.current === idToken) return;
    handledRef.current = idToken;
    setLoading(true);
    setError(null);
    signInWithGoogleIdToken(idToken)
      .catch((e) => setError(e?.message ?? 'تعذّر تسجيل الدخول بحساب Google.'))
      .finally(() => setLoading(false));
  }, [response]);

  return {
    ready: !!request,
    loading,
    error,
    promptGoogleSignIn: () => promptAsync(),
  };
}
