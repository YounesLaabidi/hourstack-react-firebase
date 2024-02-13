import { useState} from "react";
import { sendEmailVerification, User } from "firebase/auth";
import { useAuth } from "@/contexts/AuthProvider";


const sendVerificationEmail: React.FC = () => {
  const [isSent, setIsSent] = useState<boolean>(false);

  const { currentUser } = useAuth();
  const confirmEmail = async () => {
    try {
      await sendEmailVerification(currentUser as User);
      setIsSent(true);
    } catch (error) {}
  };

  return (
    <div
      className={`text-sm text-center py-3 text-zinc-900 ${
        !isSent ? "bg-orange-400" : "bg-green-400"
      } custom-width-verification`}
    >
      Your email is not Verified Yet!{" "}
      <button
        className="font-semibold underline"
        onClick={confirmEmail}
        disabled={isSent}
      >
        {isSent ? "isSented" : "Send Verification Email"}
      </button>
    </div>
  );
};

export default sendVerificationEmail;
