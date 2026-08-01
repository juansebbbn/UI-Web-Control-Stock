import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "cs_session";
const PUBLIC_PATHS = ["/login", "/registro"];

/**
 * Gate-keeper de todas las rutas. Next.js 16 renombró `middleware.ts` a
 * `proxy.ts` (la función exportada pasó a llamarse `proxy`) — ver AGENTS.md.
 * Solo chequea que exista la cookie de sesión, no valida el JWT en sí; eso
 * lo hace el backend en cada request.
 */
export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic = pathname === "/" || PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const hasSession = req.cookies.has(SESSION_COOKIE);

  if (!isPublic && !hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname !== "/" && isPublic && hasSession) {
    return NextResponse.redirect(new URL("/negocio", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
