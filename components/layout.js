"use client";

import React from "react";
import Navbar from "./graphic/navbar";
import "../components/materialize.css";
import { usePathname } from "next/navigation";
import {
  createTheme,
  ThemeProvider,
  Box
} from "@mui/material";
import { red } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: red[900],
      light: "#ff7961",
      dark: "#ba000d",
    },
  },
});

export default function Layout({ children }) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  return (
    <>
      <ThemeProvider theme={theme}>
        {!isLoginPage && (
          <>
            <Navbar />
            <Box sx={{ height: 64 }} />
          </>)}
        {children}
      </ThemeProvider>
    </>
  );
}
