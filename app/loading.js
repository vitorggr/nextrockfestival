"use client";

import { CircularProgress, Box } from "@mui/material";

export default function Loading() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress />
    </Box>
  );
}