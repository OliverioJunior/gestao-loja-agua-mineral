import { NextRequest, NextResponse } from "next/server";
// import { decrypt } from "@/shared/lib/session";

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

  // try {
  //   // Verificar se há uma sessão válida
  //   const sessionCookie = request.cookies.get("session")?.value;
  //   const session = await decrypt(sessionCookie);

  //   if (!sessionCookie) {
  //     // Se não há sessão, redirecionar para login
  //     return NextResponse.redirect(new URL("/login", request.url));
  //   }

  //   if (!session || !session.email) {
  //     // Se a sessão é inválida, limpar cookie e redirecionar para login
  //     const response = NextResponse.redirect(new URL("/login", request.url));
  //     response.cookies.delete("session");
  //     return response;
  //   }

  //   // Se chegou até aqui, a sessão é válida
  //   return NextResponse.next();
  // } catch (error) {
  //   // Se houve erro ao descriptografar, limpar cookie e redirecionar para login
  //   console.error("[MIDDLEWARE] Erro ao validar sessão:", error);
  //   const response = NextResponse.redirect(new URL("/login", request.url));
  //   response.cookies.delete("session");
  //   return response;
  // }

  return NextResponse.next();
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
