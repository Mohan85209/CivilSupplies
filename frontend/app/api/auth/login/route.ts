import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const resp = await fetch(`${API_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await resp.json();
    if (!resp.ok) {
      return NextResponse.json(data, { status: resp.status });
    }

    // backend expected to return access_token or token
    const token = data.access_token || data.token || data.accessToken || null;
    if (!token) {
      return NextResponse.json({ detail: "No token returned from auth" }, { status: 500 });
    }

    const isProd = process.env.NODE_ENV === "production";
    const maxAge = 60 * 60 * 24 * 30; // 30 days
    const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Strict; ${isProd ? "Secure; " : ""}`;

    return new NextResponse(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Set-Cookie": cookie, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return NextResponse.json({ detail: err?.message || "Internal error" }, { status: 500 });
  }
}
