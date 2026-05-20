import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    // Read token from cookies available to server routes
    // Note: in edge runtimes, cookie parsing differs; Next provides headers here.
    const token = _req.headers.get("cookie")?.split("token=").pop()?.split(";")[0];

    const resp = await fetch(`${API_URL}/api/quotes/${params.id}/boq`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      redirect: "manual",
    });

    // If backend responded with a redirect (presigned URL), forward it
    if (resp.status >= 300 && resp.status < 400) {
      const location = resp.headers.get("location");
      if (location) return NextResponse.redirect(location);
    }

    // Otherwise, stream the response body back
    const headers = new Headers();
    resp.headers.forEach((v, k) => headers.set(k, v));
    const body = await resp.arrayBuffer();
    return new NextResponse(body, { status: resp.status, headers });
  } catch (err: any) {
    return NextResponse.json({ detail: err?.message || "Internal error" }, { status: 500 });
  }
}
