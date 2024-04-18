import { CrossmintAdapter } from "@/services/CrossmintAdapter";
import { FirebaseAdapter } from "@/services/FirebaseAdapter";
import { ReportBugReview } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (!request.body) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const body = (await request.json()) as ReportBugReview;

  const firebaseAdapter = new FirebaseAdapter();
  const crossmintAdapter = new CrossmintAdapter();

  await firebaseAdapter.saveToDB("review_report", body);

  if (body.status === "approved") {
    const reportId = body.reportId;
    const report = await firebaseAdapter.getFromDBById("bug_report", reportId);
    await firebaseAdapter.changeField(
      "bug_report",
      body.reportId,
      "status",
      "approved"
    );
    // TODO: Send email to user
    const nfts = await crossmintAdapter.getNFTsFromCollection(
      process.env.COLLECTION_ID!
    );

    const nft = await getNFTIfAny(report.userIdentifier, nfts);
    if (nft) {
      const nftUpdateOptions = getNFTUpdate(nft);
      await crossmintAdapter.updateNFTMetadata(
        process.env.COLLECTION_ID!,
        nft.id,
        nftUpdateOptions
      );
    } else {
      await crossmintAdapter.mintNFT(
        process.env.COLLECTION_ID!,
        `email:${report.userIdentifier}:polygon-amoy`
      );
    }
  } else {
    await firebaseAdapter.changeField(
      "bug_report",
      body.reportId,
      "status",
      "rejected"
    );
    // TODO: Send email
  }

  return NextResponse.json({ message: "OK" }, { status: 200 });
}

async function getNFTIfAny(email: string, nfts: any[]) {
  const wallets = await new CrossmintAdapter().getUserWallet(email);
  if (wallets == null) {
    return null;
  }
  const polygonWallet = wallets.find((w: any) => w.chain === "polygon-amoy");
  const nft = nfts.find((nft) => nft.onChain.owner === polygonWallet.publicKey);
  if (nft === null) {
    return null;
  }
  return nft;
}

const SILVER_NFT = {
  metadata: {
    image: "https://utfs.io/f/4ec4342d-1b97-4ec7-95d2-6c97752d97ab-8yltf2.jpg",
    name: "BUG RANGER",
    attributes: [
      {
        trait_type: "Level",
        value: "Bug Ranger",
      },
      {
        trait_type: "Bugs reported",
        value: "10-19",
      },
      {
        trait_type: "Last bug reported at",
        value: new Date().toISOString(),
      },
    ],
  },
};

const GOLD_NFT = {
  metadata: {
    image: "https://utfs.io/f/4ec4342d-1b97-4ec7-95d2-6c97752d97ab-8yltf2.jpg",
    name: "BUG MASTER",
    attributes: [
      {
        trait_type: "Level",
        value: "Bug Master",
      },
      {
        trait_type: "Bugs reported",
        value: ">20",
      },
      {
        trait_type: "Last bug reported at",
        value: new Date().toISOString(),
      },
    ],
  },
};

function getNFTUpdate(nft: any) {
  if (nft.metadata.name === "BUG RANGER") {
    return GOLD_NFT;
  }
  return SILVER_NFT;
}
