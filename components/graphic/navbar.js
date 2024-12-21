"use client";

import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link";
import Image from "next/image";
import LoginButton from "./loginbutton";

export default function Navbar() {
  const [anchor, setAnchor] = useState(null); 

  const handleMenuOpen = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchor(null);
  };

  const menuItems = [
    { label: "Início", href: "/" },
    { label: "Bandas", href: "/bandas" },
    { label: "Inscrição", href: "/inscricao" },
    { label: "Fale conosco", href: "/contato" },
  ];

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "black", marginBottom:10 }}>
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Image
            src={"/logo.jpeg"}
            alt="Logo"
            width={120}
            height={40}
            style={{ cursor: "pointer" }}
          />
        </Box>

        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          {menuItems.map((item) => (
            <Button
              key={item.label}
              color="inherit"
              component={Link}
              href={item.href}
              sx={{ color: "white" }}
            >
              {item.label}
            </Button>
          ))}
          <LoginButton />
        </Box>

        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleMenuOpen}
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchor={anchor}
            open={Boolean(anchor)}
            onClose={handleMenuClose}
          >
            {menuItems.map((item) => (
              <MenuItem
                key={item.label}
                onClick={handleMenuClose}
                component={Link}
                href={item.href}
              >
                {item.label}
              </MenuItem>
            ))}
            <MenuItem onClick={handleMenuClose}>
              <LoginButton />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
