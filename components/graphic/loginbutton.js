"use client";

import React from "react";
import { Button, Tooltip } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../auth/auth";
import { useRouter } from "next/navigation";
export default function LoginButton() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div>
      {user ? (
        <Tooltip title="Logout">
          <Button
            onClick={handleLogout}
            color="inherit"
            startIcon={<LogoutIcon />}
            sx={{ color: "white", textTransform: "none", fontSize: "16px" }}
          />
        </Tooltip>
      ) : (
        <Tooltip title="Login">
          <Button
            onClick={handleLogin}
            color="inherit"
            startIcon={<PersonIcon />}
            sx={{ color: "white", textTransform: "none", fontSize: "16px" }}
          />
        </Tooltip>
      )}
    </div>
  );
}
