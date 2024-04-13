import EditProfile from "../auth/EditProfile";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
 import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import ProfileIcon from "./ProfileIcon";
import { useTheme } from "@/contexts/ThemeProvider";
import EditIcon from "./EditIcon";
import SignoutIcon from "./Signout";
import SaveToLaterIcon from "./SaveToLaterIcon";
import TaskIcon from "./TaskIcon";
export default function ProfileToggle() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { signout } = useAuth();
   return (
    <div className="">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="focus-visible:ring-0"
          >
             <ProfileIcon theme={theme} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
             <EditIcon theme={theme} />
            <span className="ms-2"> Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link className="w-full flex" to="/uncompleted">
              <SaveToLaterIcon theme={theme} />{" "}
              <span className="ms-2">Saved</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link className="w-full flex" to="/tasks">
              <TaskIcon theme={theme} /> <span className="ms-2">Tasks</span>
            </Link>
          </DropdownMenuItem>{" "}
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
