import { FirebaseAdapter } from "@/services/FirebaseAdapter";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const fetchCache = "force-no-store";

export async function GET() {
  revalidatePath("/api/reports");
  const reports = await new FirebaseAdapter().getFromDB("bug_report");

  return NextResponse.json({ status: "OK", data: reports }, { status: 200 });
}
