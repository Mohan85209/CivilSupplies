import { NextResponse } from "next/server";

export async function POST() {
  const cookie = `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict;`;
  return new NextResponse(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Set-Cookie": cookie, "Content-Type": "application/json" },
  });
}
