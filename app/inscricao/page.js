import Inscricao from './inscricao';
import { Suspense } from 'react';
import { CircularProgress, Box } from "@mui/material";

// Função para buscar os dados da API com cache no servidor a fim de obter os dados antes
// da renderização da página e reduzir a necessidade de chamadas na api
export async function fetchEstados() {
  const response = await fetch(
    "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome",
    {
      next: { revalidate: 172800 },
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar estados");
  }

  return response.json();
}

// Componente que busca os dados e os passa como props
// para o client component de inscrição
async function InscricaoClientSide() {
  const estados = await fetchEstados();

  return <Inscricao estados={estados} />;
}

// Página server-side que utiliza streaming SSR para carregar os dados de forma progressiva
export default function Page() {
  return (
    <>
      <Suspense fallback={
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh">
          <CircularProgress />
        </Box>}>
        <InscricaoClientSide />
      </Suspense>
    </>
  );
}
