"use client";

import React from "react";
import {
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { Controller } from "react-hook-form";

export default function DadosGerais({
  control,
  register,
  errors,
  estados,
  cidades,
  selectedEstado,
}) {
  return (
    <>
      <TextField
        fullWidth
        label="Nome da Banda"
        {...register("nome", { required: "Nome da banda é obrigatório" })}
        margin="normal"
        error={!!errors.nome}
        helperText={errors.nome?.message}
        InputLabelProps={{
          shrink: true, 
        }}
      />
      <TextField
        fullWidth
        label="Breve Release"
        {...register("release", { required: "Release é obrigatório" })}
        margin="normal"
        multiline
        rows={4}
        error={!!errors.release}
        helperText={errors.release?.message}
        InputLabelProps={{
          shrink: true,  
        }}
      />

      {/* Estado */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Estado</InputLabel>
        <Controller
          name="estado"
          control={control}
          defaultValue=""
          rules={{ required: "Estado é obrigatório" }}
          render={({ field }) => (
            <Select {...field} error={!!errors.estado}>
              {estados.map((estado) => (
                <MenuItem key={estado.id} value={estado.sigla}>
                  {estado.sigla} - {estado.nome}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.estado && (
          <p style={{ color: "red" }}>{errors.estado.message}</p>
        )}
      </FormControl>

      {selectedEstado && (
        <FormControl fullWidth margin="normal">
          <InputLabel>Cidade</InputLabel>
          <Controller
            name="cidade"
            control={control}
            defaultValue=""
            rules={{ required: "Cidade é obrigatória" }}
            render={({ field }) => (
              <Select {...field} error={!!errors.cidade}>
                {cidades.map((municipio) => (
                  <MenuItem key={municipio.id} value={municipio.nome}>
                    {municipio.nome}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.cidade && (
            <p style={{ color: "red" }}>{errors.cidade.message}</p>
          )}
        </FormControl>
      )}
    </>
  );
}
