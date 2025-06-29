import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { supabase } from "@/lib/supabase/Client";
import { createClient } from "./lib/supabase/Server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  // await updateSession(request);

  // const supabase = await createClient();

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  // const pathname = request.nextUrl.pathname;

  // const publicRoutes = ["/login", "/register", "/verify-email"];

  // // console.log(`user: `, user);

  // if (publicRoutes.includes(pathname) && !user) {
  //   return response;
  // }

  // if (!user) {
  //   const loginUrl = new URL("/login", request.url);
  //   return NextResponse.redirect(loginUrl);
  // }

  // if (!user.email_confirmed_at) {
  //   const verifyEmailUrl = new URL("/verify-email", request.url);
  //   return NextResponse.redirect(verifyEmailUrl);
  // }

  // if (user && publicRoutes.includes(pathname)) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.svg).*)"],
};
