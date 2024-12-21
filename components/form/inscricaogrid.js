'use client';

import React, { useState, useEffect, Suspense } from "react";
import { Box, Typography, Container, IconButton, Snackbar, Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getList, deleteInscricao } from "../requests/firestore";
import { useAuth } from "../../components/auth/auth";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function InscricaoGrid({ reload, onEdit }) {
  const [Inscricao, setInscricao] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);  // Estado para controlar a exibição do modal
  const [selectedId, setSelectedId] = useState(null); // Estado para armazenar o ID selecionado para exclusão
  const { user } = useAuth();

  // Função para buscar as inscrições de forma assíncrona
  const fetchInscricao = async () => {
    try {
      const data = await getList(user.uid);
      setInscricao(data);
    } catch (error) {
      setSnackbarMessage("Erro ao carregar a lista.");
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (inscricao) => {
    onEdit(inscricao);
  };

  useEffect(() => {
    fetchInscricao();
  }, [reload]);

  const handleDelete = async (id) => {
    const success = await deleteInscricao(id);
    if (success) {
      setInscricao((prev) => prev.filter((inscricao) => inscricao.id !== id));
      setSnackbarMessage("Inscrição excluída com sucesso.");
      reload = false;
    } else {
      setSnackbarMessage("Erro ao excluir a inscrição. Tente novamente.");
    }
    setOpenSnackbar(true);
    setOpenDialog(false); // Fechar o modal após a exclusão
  };

  const handleOpenDialog = (id) => {
    setSelectedId(id); // Armazenar o ID da inscrição a ser excluída
    setOpenDialog(true); // Abrir o modal de confirmação
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Fechar o modal sem excluir
    setSelectedId(null); // Limpar o ID selecionado
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

  const rows = Inscricao.map((inscricao) => ({
    id: inscricao.id,
    nome: inscricao.nome,
    origem: inscricao.cidade + " - " + inscricao.estado,
    countMembros: inscricao.integrantes.length,
    integrantes: inscricao.integrantes,
    estado: inscricao.estado,
    cidade: inscricao.cidade,
    longevidade: inscricao.longevidade,
    release: inscricao.release
  }));

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

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
            hideFooterPagination={true}
            hideFooterSelectedRowCount={true} 
            componentsProps={{
              footer: {
                showSelectedRowCount: false, 
              }
            }}
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
