export type Meme = {
  id: string;
  name: string;
  image: string;
  caption: string;
  likes: number;
  dislikes: number;
  heart: number;
};

export type Project = {
  ticker: string;
  symbol: string;
  logo: string;
  description: string;
  publicKey: string;
  decimals: number;
  marketCap: number;
  price: number;
  memes: Meme[];
};

export type TokenMetadata = {
  name: string
  symbol: string
  description: string
  image: string
  createdOn?: string
  telegram?: string
  website?: string
  creator?: {
    name: string
    site: string
  }
}
