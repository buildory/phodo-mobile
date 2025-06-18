import { createContext, useContext, useEffect, useState } from 'react';
import { getSupabaseClient } from '@/shared/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

const AuthContext = createContext<{
  user: User | null;
  session: Session | null;
  loading: boolean;
  sessionChecked: boolean;
}>({ user: null, session: null, loading: true, sessionChecked: false });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);
;
useEffect(() => {
  const supabase = getSupabaseClient();
  const restoreSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);
  };

  restoreSession();

  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
    setUser(session?.user ?? null);
    setSessionChecked(true);
  });

  return () => {
    listener.subscription.unsubscribe();
  };
}, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, sessionChecked }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);