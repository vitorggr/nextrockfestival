import React from 'react';
import Layout from '../components/layout'; 
import { AuthProvider } from "../components/auth/auth";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Next Rock Festival',
  description: 'O festival do futuro',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="m-3">
        <AuthProvider>
          <Layout>
            {children}
          </Layout>
        </AuthProvider>
      </body>
    </html>
  );
}