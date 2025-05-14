'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import ReactPaginate from 'react-paginate';
import Image from 'next/image';

const Bandas = ({ artists, slugDictionary }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();
  const ITEMS_PER_PAGE = 9;

  //Função utilizada para ajustar o comportamento em produção 
  //uma vez que a renderização do lado do servidor pode ocorrer antes do objeto sessionStorage estar disponível 
  const handleSessionStorage = {
    getItem: (key) => {
      if (typeof window === 'undefined') return null;
      return sessionStorage.getItem(key);
    },
    setItem: (key, value) => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(key, value);
      }
    },
  };

  // Guardando o dicionário no sessionStorage somente quando necessário
  useEffect(() => {
    if (slugDictionary && !window.sessionStorage.getItem('slugDictionary')) {
      window.sessionStorage.setItem('slugDictionary', JSON.stringify(slugDictionary));
    }
  }, [slugDictionary]);

  const lstArtist = useMemo(() => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    return artists.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, artists]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleCardClick = (artist) => {
    router.push(`/bandas/${artist.slug}`);
  };

  return (
    <Box sx={{ padding: 10 }}>
      <Grid container spacing={4}>
        {lstArtist.map((artist) => (
          <Grid item xs={12} sm={6} md={4} key={artist.id}>
            <Card onClick={() => handleCardClick(artist)} sx={{ cursor: 'pointer' }}>
              <Box sx={{ position: 'relative', height: 300 }}>
                <Image
                  src={artist.image}
                  alt={artist.name}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="top"
                  quality={75}
                />
              </Box>
              <CardContent>
                <Typography variant="h6" component="div">
                  {artist.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <ReactPaginate
          breakLabel="..."
          nextLabel="Próximo"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={Math.ceil(artists.length / ITEMS_PER_PAGE)}
          previousLabel="Anterior"
          containerClassName="pagination"
          activeClassName="active"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          nextClassName="page-item"
          previousLinkClassName="page-link"
          nextLinkClassName="page-link"
        />
      </Box>
    </Box>
  );
};

export default Bandas;
