'use client';

import React, { useState, useEffect, Suspense } from "react";
import { Box, Typography, Container, IconButton, Snackbar, Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getList, deleteInscricao } from "../requests/firestore";
import { useAuth } from "../../components/auth/auth";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function InscricaoGrid({ reload, onEdit }) {
  const [inscricoes, setInscricoes] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const { user } = useAuth();

  // Função para buscar as inscrições de forma assíncrona
  const fetchInscricoes = async () => {
    try {
      const data = await getList(user.uid);
      setInscricoes(data);
    } catch (error) {
      setSnackbarMessage("Erro ao carregar a lista.");
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    fetchInscricoes();
  }, [reload]);

  const handleEdit = (inscricao) => {
    onEdit(inscricao);
  };

  const handleDelete = async (id) => {
    const success = await deleteInscricao(id);
    if (success) {
      setInscricoes((prev) => prev.filter((inscricao) => inscricao.id !== id));
      setSnackbarMessage("Inscrição excluída com sucesso.");
      reload = false;
    } else {
      setSnackbarMessage("Erro ao excluir a inscrição. Tente novamente.");
    }
    setOpenSnackbar(true);
    setOpenDialog(false);
  };

  const handleOpenDialog = (id) => {
    setSelectedId(id); 
    setOpenDialog(true); 
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); 
    setSelectedId(null); 
  };

  const columns = [
    { field: "nome", headerName: "Nome", width: 400 },
    { field: "countMembros", headerName: "Membros", width: 80 },
    { field: "origem", headerName: "Origem", width: 200 },
    {
      field: "acoes",
      headerName: "",
      width: 100,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row)} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleOpenDialog(params.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const rows = inscricoes.map((inscricao) => ({
    id: inscricao.id,
    nome: inscricao.nome,
    origem: `${inscricao.cidade} - ${inscricao.estado}`,
    countMembros: inscricao.integrantes.length,
    integrantes: inscricao.integrantes,
    estado: inscricao.estado,
    cidade: inscricao.cidade,
    longevidade: inscricao.longevidade,
    release: inscricao.release,
  }));

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Validação para não renderizar o componente se não houver inscrições
  if (inscricoes.length === 0) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Minhas Inscrições
      </Typography>

      <Box sx={{ height: 300, width: "100%", marginTop: 2 }}>
        <Suspense fallback={<CircularProgress color="primary" />}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            checkboxSelection={false}
            selectionModel={[]}
            hideFooterPagination
            hideFooterSelectedRowCount
          />
        </Suspense>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Você realmente deseja excluir esta inscrição?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="black">
            Cancelar
          </Button>
          <Button onClick={() => handleDelete(selectedId)} color="primary">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <Button color="inherit" size="small" onClick={handleCloseSnackbar}>
            Fechar
          </Button>
        }
      />
    </Container>
  );
}
