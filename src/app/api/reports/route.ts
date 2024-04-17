import { FirebaseAdapter } from "@/services/FirebaseAdapter";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const reports = await new FirebaseAdapter().getFromDB();

  return NextResponse.json({ status: "OK", data: reports }, { status: 200 });
}
