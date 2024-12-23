"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../components/auth/firebase";
import { useAuth } from "../../components/auth/auth";
import { useRouter } from "next/navigation";
import Signup from "../../components/auth/signup";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert
} from "@mui/material";

export default function Login() {
  const { user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);

      //Guarda o token do usuário em cookie para validação de permissão
      const token = await credential.user.getIdToken();
      setCookie(null, "token", token, { path: "/" });

      setSuccess("Login bem-sucedido!");
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Container maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          {showSignup ? (
            <Signup />
          ) : (
            <>
              <Typography variant="h4" gutterBottom>
                Login
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
              <form onSubmit={handleLogin} style={{ width: "100%", marginTop: "16px" }}>
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
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Entrar
                </Button>
              </form>
            </>
          )}
          <Button
            onClick={() => setShowSignup(!showSignup)}
            variant="text"
            sx={{ mt: 2 }}
          >
            {showSignup
              ? "Já possui uma conta? Faça login."
              : "Não possui uma conta? Registre-se."}
          </Button>
        </Box>
      </Container>
    </>
  );
}
