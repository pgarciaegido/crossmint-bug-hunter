import { NextRequest, NextResponse } from "next/server";

interface ReportBugBodyPayload {
  title: string;
  description: string;
  url: string;
  userIdentifier: {
    id: string;
    type: "email";
  };
}

export async function POST(request: NextRequest) {
  if (!request.body) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const body = (await request.json()) as ReportBugBodyPayload;

  // TODO: Save the report in a Database

  return NextResponse.json({ message: "OK" }, { status: 200 });
}
