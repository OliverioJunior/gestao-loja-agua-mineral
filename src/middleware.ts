import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/shared/lib/session";

// Rotas que não precisam de autenticação
const publicRoutes = ["/login", "/api/auth/signin"];

// Rotas da API que não precisam de autenticação
const publicApiRoutes = ["/api/auth/signin", "/api/auth/signout"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir acesso a rotas públicas
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Permitir acesso a rotas da API públicas
  if (publicApiRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Verificar se há uma sessão válida
  const sessionCookie = request.cookies.get("session")?.value;

  if (!sessionCookie) {
    // Se não há sessão, redirecionar para login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Tentar descriptografar e validar a sessão
    const session = await decrypt(sessionCookie);

    if (!session || !session.email) {
      // Se a sessão é inválida, redirecionar para login

      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Se chegou até aqui, a sessão é válida

    return NextResponse.next();
  } catch (error) {
    // Se houve erro ao descriptografar, redirecionar para login
    console.error("[MIDDLEWARE] Erro ao validar sessão:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Configurar quais rotas o middleware deve interceptar
export const config = {
  matcher: [
    /*
     * Interceptar todas as rotas exceto arquivos estáticos
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
