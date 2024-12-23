import { NextResponse } from "next/server";

export async function middleware(request) {

  const token = request.cookies.get("token");

  //Valida se o token do usuário é valido 
  // para forçar redirecionamento em caso de usuário não logado
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/inscricao/:path*"]
};
