'use client'; // Declara que o componente é um cliente

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Breadcrumbs,
  Link,
} from "@mui/material";

// Função para buscar dados do artista com revalidação de cache 
// para economizar requisições desnecessárias
export async function fetchArtistData(artistId) {
  try {
    const response = await fetch(
      `https://www.theaudiodb.com/api/v1/json/2/artist.php?i=${artistId}`,
      {
        next: { revalidate: 86400 }, // Revalida os dados a cada 24 horas (86400 segundos)
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar dados do artista");
    }

    const data = await response.json();
    return data.artists?.[0] || null;
  } catch (error) {
    console.error("Erro ao buscar dados do artista:", error);
    return null;
  }
}

const BandaPage = () => {
  const [artist, setArtist] = useState(null);
  const { slug } = useParams();

  useEffect(() => {
    const slugDictionary = JSON.parse(sessionStorage.getItem("slugDictionary"));

    // Aqui o dicionário armazenado em sessão busca o id condizente com o nome passado na url.
    // Desta forma a página dinâmica consulta as informações a partir do id, uma vez que a API não suporta buscas por nome.
    if (slugDictionary && slugDictionary[slug]) {
      const artistId = slugDictionary[slug];

      // Verifica se o id do artista já foi buscado antes
      if (!sessionStorage.getItem(`artist-${artistId}`)) {
        // Função para buscar dados do artista com base no ID
        const fetchArtist = async () => {
          const fetchedArtist = await fetchArtistData(artistId); 
          setArtist(fetchedArtist);
          // Armazena a resposta no sessionStorage para evitar requisições repetidas
          sessionStorage.setItem(`artist-${artistId}`, JSON.stringify(fetchedArtist));
        };

        fetchArtist();
      } else {
        // Carrega os dados do sessionStorage, se já tiver sido buscado antes
        setArtist(JSON.parse(sessionStorage.getItem(`artist-${artistId}`)));
      }
    }
  }, [slug]);

  if (!artist) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ padding: 4 }}>
      <Box>
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{
            padding: "8px 16px",
            borderRadius: "10px",
            marginBottom: "16px",
            maxWidth: "320px",
            width: "auto",
            display: "inline-block",
            backgroundColor: "white",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            fontSize: "0.875rem",
            height: "50%",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          <Link href="/">
            <Typography color="text.primary" sx={{ display: "inline-block" }}>
              Home
            </Typography>
          </Link>
          <Link href="/bandas">
            <Typography color="text.primary" sx={{ display: "inline-block" }}>
              Bandas
            </Typography>
          </Link>
          <Typography color="text.primary" sx={{ display: "inline-block" }}>
            {artist.strArtist}
          </Typography>
        </Breadcrumbs>
      </Box>

      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 2,
        }}
      >
        <img
          src={artist.strArtistThumb}
          alt={artist.strArtist}
          width={500}
          height={500}
          style={{
            objectFit: "cover",
            marginBottom: 2,
          }}
        />
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            {artist.strArtist}
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{
              textAlign: "justify",
              textIndent: "30px",
              lineHeight: 1.2,
              fontSize: "1.5rem",
            }}
          >
            {artist.strBiographyPT}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BandaPage;
