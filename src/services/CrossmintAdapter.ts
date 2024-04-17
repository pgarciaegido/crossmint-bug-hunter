const secret = process.env.CROSSMINT_SECRET;
const CROSSMINT_BASE_URL = `https://${process.env.CROSSMINT_ENV}.crossmint.com/api`;

export class CrossmintAdapter {
  async mintNFT(collectionId: string, recipient: string) {
    const options: any = {
      method: "POST",
      headers: {
        "x-api-key": secret,
      },
      body: JSON.stringify({
        recipient,
        // TODO: NFT MINT metadata
        metadata: {
          name: "Crossmint Test NFT",
          image: "https://picsum.photos/400",
          description: "My first NFT using Crossmint",
        },
      }),
    };
    return await fetch(
      `${CROSSMINT_BASE_URL}/2022-06-09/collections/${collectionId}/nfts`,
      options
    );
  }
}
