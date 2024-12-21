"use client";

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function MembrosGrid({ integrantes, handleEditIntegrante, handleDeleteIntegrante }) {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Instrumentos</TableCell>
                    <TableCell>Líder</TableCell>
                    <TableCell>Ações</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {integrantes.map((integrante, index) => (
                    <TableRow key={index}>
                        <TableCell>{integrante.nome}</TableCell>
                        <TableCell>{integrante.email}</TableCell>
                        <TableCell>{integrante.instrumentos.join(', ')}</TableCell>
                        <TableCell>{integrante.lider ? 'Sim' : 'Não'}</TableCell>
                        <TableCell>
                            <IconButton onClick={() => handleEditIntegrante(index)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteIntegrante(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};