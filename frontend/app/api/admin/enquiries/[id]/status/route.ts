import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get("cookie")?.split("token=").pop()?.split(";")[0];
    let status: string | undefined;
    const ct = req.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const body = await req.json().catch(() => null);
      status = body?.status;
    } else if (ct.includes("application/x-www-form-urlencoded") || ct.includes("multipart/form-data")) {
      const form = await req.formData();
      status = form.get("status") as string | undefined;
    } else {
      const text = await req.text().catch(() => "");
      try {
        const j = JSON.parse(text || "{}");
        status = j.status;
      } catch {
        // ignore
      }
    }

    if (!status) return NextResponse.json({ detail: "Missing status" }, { status: 400 });

    const resp = await fetch(`${API_URL}/api/enquiries/${params.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    const data = await resp.json().catch(() => null);
    return NextResponse.json(data || { ok: resp.ok }, { status: resp.status });
  } catch (err: any) {
    return NextResponse.json({ detail: err?.message || "Internal error" }, { status: 500 });
  }
}
