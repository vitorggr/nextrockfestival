"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Container,
  Typography,
  Radio,
  Snackbar
} from "@mui/material";
import { useAuth } from "../../components/auth/auth"; 
import DadosGerais from "../../components/form/dadosgerais";
import Membros from "../../components/form/membros";
import MembrosGrid from "../../components/form/membrosgrid";
import InscricaoGrid from "../../components/form/inscricaogrid";
import Footer from "../../components/graphic/footer";
import axios from "axios";
import { post, put } from '../../components/requests/firestore';

export default function Inscricao({ estados }) {
  const { user } = useAuth();
  const router = useRouter();
  const { control, handleSubmit, register, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      longevidade: ''
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [integrante, setIntegrante] = useState({
    nome: "",
    email: "",
    lider: false,
    instrumentos: [],
  });
  const [integrantes, setIntegrantes] = useState([]);
  const [isReload, setReload] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [cidades, setCidades] = useState([]);
  const [membrosError, setMembrosError] = useState("");
  const [liderError, setLiderError] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("");

  useEffect(() => {
    // Verifica se o usuário está logado
    if (!user) {
      // Se o usuário não estiver logado, redireciona para a página de login para proteger a rota
      // Uma camada adicional tambem é implementada via cookie em middleware.js
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    setSelectedEstado(watch("estado"));
  }, [watch("estado")]);

  useEffect(() => {
    const fetchCidades = async () => {
      if (selectedEstado) {
        try {
          const response = await axios.get(
            `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedEstado}/municipios`
          );
          setCidades(response.data);
        } catch (error) {
          console.error("Erro ao carregar cidades:", error);
        }
      }
    };
    fetchCidades();
  }, [selectedEstado]);

  const handleIntegranteChange = (event) => {
    const { name, value, checked } = event.target;

    if (name === "instrumentos") {
      let updatedInstrumentos = [...integrante.instrumentos];

      if (checked) {
        updatedInstrumentos.push(value);
      } else {
        updatedInstrumentos = updatedInstrumentos.filter(instr => instr !== value);
      }

      setIntegrante(prev => ({
        ...prev,
        instrumentos: updatedInstrumentos,
      }));
    } else {
      setIntegrante(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleEditInscricao = (data) => {
    reset(data);
    setIntegrantes(data.integrantes);
    setIsEditing(true);
    setEditId(data.id);
  };

  const handleAddIntegrante = () => {
    if (!integrante.nome || !integrante.email) {
      setMembrosError("Nome e email do integrante são obrigatórios");
      return;
    }

    if (!integrante.instrumentos.length) {
      setMembrosError("Instrumentos do integrante são obrigatórios");
      return;
    }

    const hasLider = integrantes.some(i => i.lider);

    if (integrante.lider && hasLider && editIndex === null) {
      setLiderError("Já existe um líder na banda");
      return;
    }

    setMembrosError("");
    setLiderError("");

    if (editIndex !== null) {
      const updatedIntegrantes = [...integrantes];
      updatedIntegrantes[editIndex] = integrante;
      setIntegrantes(updatedIntegrantes);
      setEditIndex(null);
    } else {
      setIntegrantes(prev => [...prev, integrante]);
    }

    setIntegrante({ nome: "", email: "", lider: false, instrumentos: [] });
  };

  const handleEditIntegrante = (index) => {
    setIntegrante(integrantes[index]);
    setEditIndex(index);
  };

  const handleDeleteIntegrante = (index) => {
    const updatedIntegrantes = integrantes.filter((_, i) => i !== index);
    setIntegrantes(updatedIntegrantes);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (data) => {
    if (integrantes.length === 0) {
      setMembrosError("É necessário adicionar pelo menos um integrante.");
      return;
    }

    if (!integrantes.some(integrante => integrante.lider)) {
      setMembrosError("É necessário definir pelo menos um líder na banda.");
      return;
    }

    try {
      debugger;
      data.integrantes = integrantes;
      data.uidUsuario = user.uid;
      
      if (isEditing) {
        await put(editId, data);
        setMessage("Inscrição alterada com sucesso!");
      } else {
        await post(data);
        setMessage("Inscrição enviada com sucesso!");
      }

      setOpen(true);
      reset();
      setIntegrantes([]);
      setIsEditing(false);
      setReload((prev) => !prev);
    } catch (error) {
      setMessage("Erro: " + error);
      setOpen(true);
    }
  };

  // Validação para não renderizar formulário 
  // para usuário não autenticado
  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Inscrição</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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
        <Typography variant="h6">Informações Gerais</Typography>
        <DadosGerais
          control={control}
          watch={watch}
          errors={errors}
          estados={estados}
          cidades={cidades}
          selectedEstado={selectedEstado}
          register={register}
        />
        <FormControl component="fieldset" margin="normal">
          <Typography>Quanto tempo de existência da banda?</Typography>
          <Controller
            name="longevidade"
            control={control}
            rules={{ required: 'Longevidade é obrigatória' }}
            render={({ field }) => (
              <RadioGroup {...field}>
                {[
                  'Menos de 1 ano',
                  '1 ano',
                  '2 anos',
                  'Menos de 5 anos',
                  'Menos de 10 anos',
                  'Mais de 10 anos'
                ].map((option) => (
                  <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
                ))}
              </RadioGroup>
            )}
          />
          {errors.longevidade && <p style={{ color: 'red' }}>{errors.longevidade.message}</p>}
        </FormControl>
        <Typography variant="h6">Integrantes</Typography>
        <Membros
          integrante={integrante}
          handleIntegranteChange={handleIntegranteChange}
          handleAddIntegrante={handleAddIntegrante}
          editIndex={editIndex}
          liderError={liderError}
          membrosError={membrosError}
        />
        {integrantes.length > 0 && (
          <MembrosGrid
            integrantes={integrantes}
            handleEditIntegrante={handleEditIntegrante}
            handleDeleteIntegrante={handleDeleteIntegrante}
          />
        )}
        <Box sx={{ mt: 4, justify: 'center', marginBottom: 10 }}>
          <Button type="submit" variant="contained" color="primary" sx={{ width: '100%' }}>
            {isEditing ? "Alterar Inscrição" : "Enviar Inscrição"}
          </Button>
        </Box>
      </form>
      <Box sx={{ mt: 4, justify: 'center', marginBottom: 10 }}>
        <InscricaoGrid sx={{ mt: 4, justify: 'center', marginBottom: 10 }} reload={isReload} onEdit={handleEditInscricao} />
      </Box>
      <Footer />
    </Container >
  );
}
