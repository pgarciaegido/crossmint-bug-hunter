const secret = process.env.CROSSMINT_SECRET;
const CROSSMINT_BASE_URL = `https://${process.env.CROSSMINT_ENV}.crossmint.com/api`;

export class CrossmintAdapter {
  async mintNFT(collectionId: string, recipient: string) {
    const options: any = {
      method: "POST",
      headers: {
        "x-api-key": secret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        templateId: "d9c6636a-694d-4daf-8dfa-f8e7a1ea286f",
        recipient,
      }),
    };
    await fetch(
      `${CROSSMINT_BASE_URL}/2022-06-09/collections/${collectionId}/nfts`,
      options
    );
  }

  async updateNFTMetadata(collectionId: string, nftId: string, metadata: any) {
    const options: any = {
      method: "PATCH",
      headers: {
        "x-api-key": secret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(metadata),
    };
    await fetch(
      `${CROSSMINT_BASE_URL}/2022-06-09/collections/${collectionId}/nfts/${nftId}`,
      options
    );
  }

  async getNFTsFromCollection(collectionId: string) {
    const options: any = {
      method: "GET",
      headers: {
        "x-api-key": secret,
      },
    };

    const res = await fetch(
      `${CROSSMINT_BASE_URL}/2022-06-09/collections/${collectionId}/nfts?page=1&perPage=20`,
      options
    );
    return await res.json();
  }

  async getUserWallet(email: string) {
    const options: any = {
      method: "GET",
      headers: {
        "x-api-key": secret,
      },
    };

    const res = await fetch(
      `${CROSSMINT_BASE_URL}/v1-alpha1/wallets?email=${email}`,
      options
    );
    return await res.json();
  }
}
