import { CrossmintAdapter } from "@/services/CrossmintAdapter";
import { FirebaseAdapter } from "@/services/FirebaseAdapter";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const nfts = await new CrossmintAdapter().getNFTsFromCollection(
    process.env.COLLECTION_ID!
  );

  console.log("----", nfts);

  return NextResponse.json({ status: "OK" }, { status: 200 });
}
