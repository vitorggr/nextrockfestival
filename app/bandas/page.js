import Bandas from './bandas';
import { Suspense } from 'react';
import { CircularProgress, Box } from "@mui/material";

// Foi utilizada uma lista estática de IDs pois a API não possuia 
// um endpoint gratuito que retornasse uma lista aleatória
const lstBandId = [
  111279, 111644, 111393,
  111507, 111341, 111622,
  111479, 111660, 111334,
  112012, 111233, 111283,
];

// Função para buscar os dados das bandas com revalidação de cache
export async function fetchArtists() {
  try {
    // Envia várias requisições simultâneas para buscar os dados de cada banda
    const requests = lstBandId.map((id) =>
      fetch(`https://www.theaudiodb.com/api/v1/json/2/artist.php?i=${id}`, {
        next: { revalidate: 172800 }, // Revalida os dados a cada 2 dias (172800 segundos)
      })
    );
    const responses = await Promise.all(requests);

    // Dicionário para vincular o ID ao slug (usado em URLs amigáveis)
    const slugDictionary = {};
    const artists = [];

    for (const response of responses) {
      if (response.ok) {
        const data = await response.json();
        const artist = data.artists?.[0];
        if (artist) {
          const slug = artist.strArtist.replace(/\s+/g, "").toLowerCase();
          slugDictionary[slug] = artist.idArtist;

          artists.push({
            id: artist.idArtist,
            name: artist.strArtist,
            image: artist.strArtistThumb,
            slug: slug,
          });
        }
      }
    }

    return { artists, slugDictionary };
  } catch (error) {
    console.error('Erro ao buscar artistas:', error);
    return { artists: [], slugDictionary: {} };
  }
}

// Página server-side criada para buscar dados das bandas
// e passá-los como props para o componente cliente
export default function Page() {
  return (
    <>
      {/* Utilização de Streaming SSR com fallback para carregamento progressivo */}
      <Suspense fallback={
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh">
          <CircularProgress />
        </Box>}>
        <BandasLoader />
      </Suspense>
    </>
  );
}

// Componente client que carrega os dados de artistas e os renderiza
async function BandasLoader() {
  const { artists, slugDictionary } = await fetchArtists(); 

  return <Bandas artists={artists} slugDictionary={slugDictionary} />; 
}
