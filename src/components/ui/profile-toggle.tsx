import EditProfile from "../auth/EditProfile";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { useTheme } from "@/contexts/ThemeProvider";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import ProfileIcon from "./ProfileIcon";
import { useTheme } from "@/contexts/ThemeProvider";
import EditIcon from "./EditIcon";
import SignoutIcon from "./Signout";
export default function ProfileToggle() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { signout } = useAuth();
  // const { setTheme } = useTheme();
  return (
    <div className="">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="focus-visible:ring-0"
          >
            {/* <img src="profile-icon.svg" alt="" className="w-6 h-6" /> */}
            <ProfileIcon theme={theme} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            {/* <img src="edit-icon.svg" alt="edit-icon" className="w-6 h-6 me-2" /> */}
            <EditIcon theme={theme} />
            <span className="ms-2"> Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              await signout();
              navigate("/");
            }}
          >
            <SignoutIcon theme={theme} /> <span className="ms-2">Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditProfile isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
