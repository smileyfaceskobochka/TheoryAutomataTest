export interface Question {
  id: string;
  question: string;
  answer: string;
  hasImage: boolean;
  imagePath?: string;
}

export type Mode = "list" | "cards";
