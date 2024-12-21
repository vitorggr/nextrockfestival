"use client";

import React from 'react';
import { Checkbox, TextField, FormControlLabel, Box, Button, Grid2, Typography } from '@mui/material';
import { Card, CardContent } from '@mui/material';

export default function Membros({ integrante, handleIntegranteChange, handleAddIntegrante, editIndex, liderError, membrosError }) {
    return (
        <Card>
            <CardContent>
                <Grid2 item xs={12} sm={12}>
                    <TextField
                        fullWidth
                        label="Nome do Integrante"
                        name="nome"
                        value={integrante.nome}
                        onChange={handleIntegranteChange}
                        margin="normal"
                    />
                </Grid2>
                <Grid2 item xs={12} sm={12}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={integrante.email}
                        onChange={handleIntegranteChange}
                        margin="normal"
                    />
                </Grid2>
                <FormControlLabel
                    control={<Checkbox
                        checked={integrante.lider}
                        onChange={handleIntegranteChange}
                        name="lider"
                    />}
                    label="É o líder e contato da banda"
                />
                {liderError && <Typography color="error">{liderError}</Typography>}
                
                <Typography sx={{ mt: 5, mb: 2 }}>Instrumentos</Typography>
                <Grid2 container spacing={2}>
                    {['Bateria', 'Guitarra', 'Violão', 'Baixo', 'Teclado', 'Vocal'].map(instr => (
                        <Grid2 item xs={6} sm={4} key={instr}>
                            <FormControlLabel
                                control={<Checkbox
                                    value={instr}
                                    checked={integrante.instrumentos.includes(instr)}
                                    onChange={handleIntegranteChange}
                                    name="instrumentos"
                                />}
                                label={instr}
                            />
                        </Grid2>
                    ))}
                </Grid2>
                {membrosError && <Typography color="error">{membrosError}</Typography>}
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleAddIntegrante}>
                        {editIndex !== null ? 'Atualizar Integrante' : 'Adicionar Integrante'}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};
