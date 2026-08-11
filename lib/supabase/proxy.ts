import { createServerClient } from "@supabase/ssr";
import {
  NextResponse,
  type NextRequest,
} from "next/server";

import { hasEnvVars } from "../utils";

export async function updateSession(
  request: NextRequest,
) {
  let supabaseResponse =
    NextResponse.next({
      request,
    });

  if (!hasEnvVars) {
    return supabaseResponse;
  }

  const supabase =
    createServerClient(
      process.env
        .NEXT_PUBLIC_SUPABASE_URL!,
      process.env
        .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },

          setAll(cookiesToSet) {
            cookiesToSet.forEach(
              ({
                name,
                value,
              }) =>
                request.cookies.set(
                  name,
                  value,
                ),
            );

            supabaseResponse =
              NextResponse.next({
                request,
              });

            cookiesToSet.forEach(
              ({
                name,
                value,
                options,
              }) =>
                supabaseResponse.cookies.set(
                  name,
                  value,
                  options,
                ),
            );
          },
        },
      },
    );

  const { data } =
    await supabase.auth.getClaims();

  const user =
    data?.claims;

  const pathname =
    request.nextUrl.pathname;

  const isAdminRoute =
    pathname === "/admin" ||
    pathname.startsWith(
      "/admin/",
    );

  const isAuthRoute =
    pathname.startsWith(
      "/auth",
    );

  /*
    PUBLIC ROUTES:
    /
    /rezervasyon
    /konaklama
    vb.

    Bunlara login gerekmiyor.

    Sadece /admin korumalı.
  */

  if (
    isAdminRoute &&
    !user
  ) {
    const url =
      request.nextUrl.clone();

    url.pathname =
      "/auth/login";

    return NextResponse.redirect(
      url,
    );
  }

  /*
    Login olmuş admin tekrar
    login ekranına giderse
    admin paneline gönder.
  */

  if (
    isAuthRoute &&
    user &&
    pathname ===
      "/auth/login"
  ) {
    const url =
      request.nextUrl.clone();

    url.pathname =
      "/admin";

    return NextResponse.redirect(
      url,
    );
  }

  return supabaseResponse;
}