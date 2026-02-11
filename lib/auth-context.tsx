'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation'; // <--- 1. IMPORT AJOUTÉ

type SignUpMeta = {
  firstName?: string;
  lastName?: string;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  userProfile: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  // ✅ On ajoute un 3e param optionnel (sans casser les appels existants)
  signUp: (email: string, password: string, meta?: SignUpMeta) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter(); // <--- 2. ACTIVATION DU ROUTER (C'est ce qui manquait)

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    // 1. Initialisation
    const initSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    };

    initSession();

    // 2. Écouteur de changements (Connexion/Déconnexion)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) setUserProfile(data);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    router.push('/'); // <--- Maintenant ça marche car 'router' est défini plus haut
  };

  // --- VRAIE FONCTION SIGN IN ---
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  // --- VRAIE FONCTION SIGN UP (✅ + prénom/nom + show password géré côté UI) ---
  const signUp = async (email: string, password: string, meta?: SignUpMeta) => {
    const firstName = (meta?.firstName || '').trim();
    const lastName = (meta?.lastName || '').trim();

    // ✅ 1) On met le prénom/nom dans les metadata user (ne casse rien)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName || null,
          last_name: lastName || null,
        },
      },
    });

    // ✅ 2) Si tu as une table profiles + trigger, elle est souvent créée automatiquement.
    // On tente aussi un upsert (si RLS/trigger ne le permet pas, on ignore sans bloquer).
    if (!error && data?.user?.id && (firstName || lastName)) {
      try {
        await supabase
          .from('profiles')
          .upsert(
            {
              id: data.user.id,
              first_name: firstName || null,
              last_name: lastName || null,
              email: email,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          );
      } catch (e) {
        // pas bloquant : metadata suffit, et le profil pourra être rempli plus tard
        console.log('profiles upsert skipped:', e);
      }
    }

    return { error };
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, userProfile, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
