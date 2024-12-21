"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess("Usuário criado com sucesso!");
      setError("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Cadastro
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      <form onSubmit={handleSignup} style={{ width: "100%", marginTop: "16px" }}>
        <TextField
          label="Email"
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Senha"
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Confirme a Senha"
          type="password"
          placeholder="Confirme sua senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          variant="outlined"
          fullWidth
          required
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}>
          Cadastrar
        </Button>
      </form>
    </Box>
  );
}
