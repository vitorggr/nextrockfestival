"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Container,
  Typography,
  Snackbar,
} from "@mui/material";
import { db } from "../../components/auth/firebase"; 
import { collection, addDoc } from "firebase/firestore";

export default function Contato() {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      await addDoc(collection(db, "contatos"), data);
      setMessage("Formulário enviado com sucesso!");
      setOpen(true);
      reset();
    } catch (error) {
      setMessage("Erro ao enviar o formulário. Tente novamente.");
      setOpen(true);
      console.error("Erro ao adicionar documento: ", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Fale conosco
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          message={message}
          action={
            <Button color="inherit" onClick={handleClose}>
              Fechar
            </Button>
          }
        />
        <Controller
          name="titulo"
          control={control}
          defaultValue=""
          rules={{ required: "O título é obrigatório" }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Título"
              variant="outlined"
              margin="normal"
              error={!!errors.titulo}
              helperText={errors.titulo ? errors.titulo.message : ""}
            />
          )}
        />
        <Controller
          name="nome"
          control={control}
          defaultValue=""
          rules={{ required: "O nome é obrigatório" }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Nome"
              variant="outlined"
              margin="normal"
              error={!!errors.nome}
              helperText={errors.nome ? errors.nome.message : ""}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{
            required: "O e-mail é obrigatório",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "E-mail inválido",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="E-mail"
              variant="outlined"
              margin="normal"
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
            />
          )}
        />
        <Controller
          name="descricao"
          control={control}
          defaultValue=""
          rules={{ required: "A descrição é obrigatória" }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Descrição"
              multiline
              rows={4}
              variant="outlined"
              margin="normal"
              error={!!errors.descricao}
              helperText={errors.descricao ? errors.descricao.message : ""}
            />
          )}
        />
        <Box sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ width: "100%" }}
          >
            Enviar
          </Button>
        </Box>
      </form>
    </Container>
  );
}
