"use client";

import * as React from "react";
import { Parallax } from "react-parallax";
import { Box, Container, Typography, Button } from "@mui/material";
import Footer from "../components/graphic/footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function IndexPage() {
  const [primaryImage, setPrimaryImage] = useState(null);
  const [secondaryImage, setSecondaryImage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setPrimaryImage("/festival.jpg");
    setSecondaryImage("/solo.jpg");
  }, []);

  return (
    <>
      {primaryImage && (
        <Parallax bgImage={primaryImage} className="responsive-img" strength={600}>
          <div style={{ height: 280 }}>
            <h1 style={{ textAlign: "center", color: "#fff", paddingTop: 200 }}></h1>
          </div>
        </Parallax>
      )}

      <Container className="container">
        <Box component="section" id="section" className="section">
          <Container id="content" className="section">
            <Typography variant="h2" gutterBottom className="header">
              Next Rock Festival
            </Typography>
            <Typography variant="h5" gutterBottom className="flow-text">
              Venha participar do maior festival de Rock do país. São três noites de shows lendários no palco principal com nomes consagrados internacionalmente, além de um palco alternativo com bandas de garagem tentando criar seu espaço.
            </Typography>
            <br />
            <br />
            <Box mt={5}>
              <Typography variant="h3" component="div">
                <i className="mdi-content-send brown-text"></i>
              </Typography>
              <Typography variant="h6" align="right" paragraph className="right-align light">
                Faça já sua inscrição e coloque a sua banda para tocar
              </Typography>
            </Box>

            <Box display="flex" justifyContent="flex-end">
              <Button
                onClick={() => router.push("/inscricao")}
                className="btn-large waves-effect waves-light red"
              >
                QUERO ME INSCREVER
              </Button>
            </Box>
          </Container>
        </Box>
      </Container>

      {secondaryImage && (
        <Parallax bgImage={secondaryImage} className="responsive-img" strength={600}>
          <div style={{ height: 280 }}>
            <h1 style={{ textAlign: "center", color: "#fff", paddingTop: 230 }}>
              <Footer />
            </h1>
          </div>
        </Parallax>
      )}
    </>
  );
}
