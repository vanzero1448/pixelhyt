export enum Page {
  HOME = "home",
  DONATE = "donate",
  COMMUNITY = "community",
  RULES = "rules",
  OFFER = "offer",
  TERMS = "terms",
  PRIVACY = "privacy",
  SUCCESS = "success",
  FAIL = "fail",
}

export interface NavItem {
  label: string;
  page: Page;
}

export interface Rank {
  id: string;
  name: string;
  price: number;
  features: string[];
  color: string;
  popular?: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
}
