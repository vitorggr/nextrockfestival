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

export default function Inscricao({ estados }) {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const { user } = useAuth();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors }
  } = useForm({ defaultValues: { longevidade: "" } });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [integrante, setIntegrante] = useState({
    nome: "",
    email: "",
    lider: false,
    instrumentos: []
  });
  const [integrantes, setIntegrantes] = useState([]);
  const [inscricoes, setInscricoes] = useState([]);
  const [reload, setReload] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [cidades, setCidades] = useState([]);
  const [membrosError, setMembrosError] = useState("");
  const [liderError, setLiderError] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("");

  // Redireciona se não logado
  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  // Atualiza estado selecionado
  useEffect(() => {
    setSelectedEstado(watch("estado"));
  }, [watch("estado")]);

  // Busca cidades no IBGE
  useEffect(() => {
    if (!selectedEstado) return;
    axios
      .get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedEstado}/municipios`
      )
      .then(resp => setCidades(resp.data))
      .catch(console.error);
  }, [selectedEstado]);

  // Carrega inscrições do usuário
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const token = await user.getIdToken();
        const resp = await axios.get(`${API}/api/inscricao`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInscricoes(resp.data);
      } catch (err) {
        setMessage("Erro ao listar inscrições");
      }
    })();
  }, [user, reload, API]);

  // Handlers de integrantes
  const handleIntegranteChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "instrumentos") {
      let arr = [...integrante.instrumentos];
      if (checked) arr.push(value);
      else arr = arr.filter(i => i !== value);
      setIntegrante(prev => ({ ...prev, instrumentos: arr }));
    } else {
      setIntegrante(prev => ({ ...prev, [name]: value }));
    }
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
      const up = [...integrantes];
      up[editIndex] = integrante;
      setIntegrantes(up);
      setEditIndex(null);
    } else {
      setIntegrantes(prev => [...prev, integrante]);
    }
    setIntegrante({ nome: "", email: "", lider: false, instrumentos: [] });
  };

  // Edit e delete de integrante
  const handleEditIntegrante = (i) => {
    setIntegrante(integrantes[i]);
    setEditIndex(i);
  };
  const handleDeleteIntegrante = (i) =>
    setIntegrantes(integrantes.filter((_, idx) => idx !== idx));

  // Edit inscrição
  const handleEditInscricao = (data) => {
    reset(data);
    setIntegrantes(data.integrantes);
    setIsEditing(true);
    setEditId(data.id);
  };

  // Delete inscrição
  const handleDeleteInscricao = async (id) => {
    try {
      const token = await user.getIdToken();
      await axios.delete(`${API}/api/inscricao/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Verifica se o item excluído é o mesmo que está sendo editado
      if (id === editId) {
        reset();
        setIntegrantes([]);
        setIsEditing(false);
        setEditId(null);
        setMessage("Registro em edição foi excluído");
        setOpen(true);
      }
      
      setReload(r => !r);    } catch (err) {
      setMessage("Erro ao deletar registro");
      setOpen(true);
    }
  };

  const handleStatus = async (id, novoStatus) => {    try {
      const token = await user.getIdToken();      const response = await axios.patch(
        `${API}/api/inscricao/${id}/status`,
        { ativo: novoStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );      setMessage(`Status alterado para ${novoStatus ? "ativo" : "inativo"}`);
      setOpen(true);

      setInscricoes(prev => prev.map(insc =>
        insc.id === id ? { ...insc, ativo: novoStatus } : insc
      ));

    } catch (err) {

      setMessage(`Erro: ${err.response?.data?.error || err.message}`);
      setOpen(true);

      // 5. Rollback visual (opcional)
      setReload(prev => !prev);
    }
  };

  // Submit formulário
  const onSubmit = async (data) => {
    if (!integrantes.length) {
      setMembrosError("Adicione pelo menos um integrante.");
      return;
    }
    if (!integrantes.some(i => i.lider)) {
      setMembrosError("Defina um líder na banda.");
      return;
    }    try {
      // Verifica se o usuário está autenticado
      if (!user) {
        setMessage("Usuário não autenticado. Por favor, faça login novamente.");
        setOpen(true);
        router.push("/login");
        return;
      }

      const token = await user.getIdToken();
      if (!token) {
        throw new Error("Token de autenticação não encontrado");
      }

      data.integrantes = integrantes;
      
      if (isEditing) {
        const response = await axios.put(`${API}/api/inscricao/${editId}`, data, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data) {
          setMessage("Inscrição alterada com sucesso!");
        }      } else {
        // Verifica se temos o token antes de fazer a requisição
        if (!token) {
          throw new Error('Usuário não autenticado');
        }

        const response = await axios.post(`${API}/api/inscricao`, data, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data) {
          setMessage("Inscrição enviada com sucesso!");
        }
      }

      // 1. limpa form e estado de integrantes
      reset();
      setIntegrantes([]);
      setIsEditing(false);
      setEditId(null);

      // 2. aciona recarga da grid
      setOpen(true);
      setReload(prev => !prev);

    } catch (err) {      setMessage("Erro: " + (err.response?.data?.error || err.message));
      setOpen(true);
    }
  };

  const handleClose = () => setOpen(false);

  if (!user) return null;

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
          action={<Button color="inherit" onClick={handleClose}>Fechar</Button>}
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
                ].map(opt => (
                  <FormControlLabel
                    key={opt}
                    value={opt}
                    control={<Radio />}
                    label={opt}
                  />
                ))}
              </RadioGroup>
            )}
          />
          {errors.longevidade && (
            <p style={{ color: 'red' }}>{errors.longevidade.message}</p>
          )}
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

        <Box sx={{ mt: 4, mb: 10 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ width: '100%' }}
          >
            {isEditing ? "Alterar Inscrição" : "Enviar Inscrição"}
          </Button>
        </Box>
      </form>

      <Box sx={{ mt: 4, mb: 10 }}>
        <InscricaoGrid
          inscricoes={inscricoes}
          onEdit={handleEditInscricao}
          onDelete={handleDeleteInscricao}
          onChangeStatus={handleStatus}
        />
      </Box>

      <Footer />
    </Container>
  );
}
