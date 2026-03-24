import { createContext, useContext, useEffect, useState } from 'react';
import { 
    User as FirebaseUser, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut as firebaseSignOut 
} from 'firebase/auth';
import { 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc, 
    serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface Profile {
    id: string;
    plan_type: 'basic' | 'pro';
    subscription_status: 'active' | 'inactive';
    subscription_start_date?: any;
    subscription_end_date?: any;
    timezone?: string;
}

interface AuthContextType {
    user: FirebaseUser | null;
    profile: Profile | null;
    loading: boolean;
    signUp: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    updatePlan: (plan: 'basic' | 'pro', status: 'active' | 'inactive') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId: string) => {
        try {
            const docRef = doc(db, 'profiles', userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setProfile(docSnap.data() as Profile);
            } else {
                // Profile doesn't exist, create it
                const newProfile: Profile = {
                    id: userId,
                    plan_type: 'basic',
                    subscription_status: 'inactive',
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                };
                await setDoc(docRef, {
                    ...newProfile,
                    created_at: serverTimestamp(),
                    updated_at: serverTimestamp()
                });
                setProfile(newProfile);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setProfile(null);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                fetchProfile(firebaseUser.uid);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const refreshProfile = async () => {
        if (user) await fetchProfile(user.uid);
    };

    const signUp = async (email: string, password: string) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            throw error;
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            throw error;
        }
    };

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error: any) {
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error: any) {
            throw error;
        }
    };

    const value = {
        user,
        profile,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        refreshProfile,
        updatePlan: async (plan: 'basic' | 'pro', status: 'active' | 'inactive') => {
            if (!user) return;
            try {
                const docRef = doc(db, 'profiles', user.uid);
                await updateDoc(docRef, {
                    plan_type: plan,
                    subscription_status: status,
                    subscription_start_date: status === 'active' ? new Date().toISOString() : null,
                    updated_at: serverTimestamp()
                });
                await refreshProfile();
            } catch (error: any) {
                throw error;
            }
        },
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
