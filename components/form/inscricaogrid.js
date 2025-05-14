"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  IconButton,
  Snackbar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  Chip
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { CheckCircle, Cancel, ToggleOn, ToggleOff } from "@mui/icons-material";

export default function InscricaoGrid({ inscricoes, onEdit, onDelete, onChangeStatus }) {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    setOpenDialog(false);
    setOpenSnackbar(false);
  }, [inscricoes]);

  const handleEdit = (row) => onEdit(row);

  const handleOpenDialog = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedId(null);
  };

  const confirmDelete = async () => {
    try {
      await onDelete(selectedId);
      setSnackbarMessage("Inscrição excluída com sucesso.");
    } catch {
      setSnackbarMessage("Erro ao excluir inscrição.");
    } finally {
      setOpenSnackbar(true);
      setOpenDialog(false);
    }
  };

  const handleToggleStatus = async (id, novoStatus) => {
    try {
      await onChangeStatus(id, novoStatus);
      setSnackbarMessage(`Status alterado para ${novoStatus ? "ativo" : "inativo"}`);
    } catch {
      setSnackbarMessage("Erro ao alterar status");
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  const columns = [
    {
      field: "nome",
      headerName: "Nome",
      width: 260,
      headerClassName: 'header-styled'
    },
    {
      field: "countMembros",
      headerName: "Membros",
      width: 80,
      headerClassName: 'header-styled'
    },
    {
      field: "origem",
      headerName: "Origem",
      width: 200,
      headerClassName: 'header-styled'
    },
    {
      field: "acoes",
      headerName: "Ações",
      width: 100,
      sortable: false,
      headerClassName: 'header-styled',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Editar">
            <IconButton
              onClick={() => handleEdit(params.row)}
              color="primary"
              sx={{ '&:hover': { bgcolor: 'primary.light' } }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton
              onClick={() => handleOpenDialog(params.id)}
              color="error"
              sx={{ '&:hover': { bgcolor: 'error.light' } }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    },
    {
      field: "ativo",
      headerName: "Status",
      width: 150,
      headerClassName: 'header-styled',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Chip
            label={params.value ? "Ativo" : "Inativo"}
            color={params.value ? "success" : "error"}
            variant="outlined"
            icon={params.value ?
              <CheckCircle fontSize="small" /> :
              <Cancel fontSize="small" />}
            sx={{
              fontWeight: 600,
              '& .MuiChip-icon': { color: params.value ? '#2e7d32' : '#d32f2f' }
            }}
          />
          <Tooltip title={`Alternar para ${params.value ? "inativo" : "ativo"}`}>
            <IconButton
              onClick={() => handleToggleStatus(params.row.id, !params.value)}
              sx={{
                color: params.value ? 'success.main' : 'action.disabled',
                '&:hover': { bgcolor: params.value ? 'success.light' : 'error.light' }
              }}
            >
              {params.value ? <ToggleOn fontSize="large" /> : <ToggleOff fontSize="large" />}
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  const rows = inscricoes.map(insc => ({
    id: insc.id,
    nome: insc.nome,
    origem: `${insc.cidade} - ${insc.estado}`,
    countMembros: insc.integrantes.length,
    ...insc
  }));

  if (!inscricoes.length) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 8 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 600,
          letterSpacing: 0.5
        }}
      >
        Minhas Inscrições
      </Typography>

      <Box sx={{
        height: 400,
        width: "100%",
        '& .header-styled': {
          bgcolor: 'background.paper',
          fontWeight: 600,
          fontSize: '0.875rem'
        }
      }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          hideFooterPagination
          hideFooterSelectedRowCount
          sx={{
            borderRadius: 2,
            borderColor: 'divider',
            '& .MuiDataGrid-cell': {
              borderBottomColor: 'divider'
            }
          }}
        />
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ bgcolor: 'background.paper' }}>
          Confirmar exclusão
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography>Tem certeza que deseja excluir esta inscrição?</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        ContentProps={{
          sx: {
            bgcolor: 'background.paper',
            color: 'text.primary',
            fontWeight: 500
          }
        }}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={handleCloseSnackbar}
            sx={{ color: 'primary.main' }}
          >
            Fechar
          </Button>
        }
      />
    </Container>
  );
}