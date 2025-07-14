export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
  timestamp: Date;
  fileData?: {
    url: string;
    name: string;
    type: string;
  };
  isPreview?: boolean;
};

export type Chat = {
  id: string;
  title: string;
  createdAt: string;
  serviceId: string;
  blocks: Block[];
};

export type Field = {
  autoDetectable: Field;
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];

  defaultValue?: any;
};

export type Service = {
  id: string;
  name: string;
  slug: string;
  description: string;
  questionnaire: Field[];
  icon?: string;
};

export type Prediction = {
  chat_name: string;
  estimated_price: string;
  price_variation: string[];
  resale_in_year: Record<string, string>;
  user_inputs: Record<string, any>;
  chatId: string;
  blockId: string;
  image: string;
};

export type Block = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  isPinned: boolean;
  prediction: Prediction | null;
  status?: "completed" | "in_progress";
};

export type UploadedFile = {
  url: string;
  name: string;
  type: string;
};
