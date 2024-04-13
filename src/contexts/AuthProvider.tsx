import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { auth } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithPopup,
  User,
  UserCredential,
  updatePassword,
  sendEmailVerification,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import Spinner from "@/components/ui/Spinner";

interface AuthContextType {
  currentUser: User | null;
  signup: (email: string, password: string) => void;
  signin: (email: string, password: string) => Promise<UserCredential>;
  signout: () => Promise<void>;
  signinWithGoogle: () => Promise<UserCredential>;
  resetPassword: (email: string) => Promise<void>;
  updateUserEmail: (email: string) => Promise<void>;
  updateUserPassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a TimeProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(true);
    });
    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await sendEmailVerification(userCredential.user);
  };

  const signin = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

  const signout = () => signOut(auth);

  const signinWithGoogle = async () =>
    signInWithPopup(auth, new GoogleAuthProvider());

  const resetPassword = async (email: string) =>
    sendPasswordResetEmail(auth, email);

  const updateUserEmail = async (newEmail: string) => {
    // check if email is not associated with other account
    if (currentUser) await verifyBeforeUpdateEmail(currentUser, newEmail);
  };
  const updateUserPassword = async (newPassword: string) => {
    if (currentUser) updatePassword(currentUser, newPassword);
  };
  const value: AuthContextType = {
    currentUser,
    signup,
    signin,
    signout,
    signinWithGoogle,
    resetPassword,
    updateUserEmail,
    updateUserPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? <Spinner /> : children}
    </AuthContext.Provider>
  );
};
