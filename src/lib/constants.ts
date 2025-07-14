export const FURNITURE_SERVICE = {
  name: "Furniture Resale Prediction",
  description: "Get an accurate resale prediction for your furniture items",
  icon: "🪑",
  questionnaire: [
    {
      name: "photo",
      label: "Upload a photo of the furniture",
      type: "file",
      required: true,
    },
    {
      name: "itemType",
      label: "What type of furniture is it?",
      type: "dropdown",
      required: true,
      autoDetectable: true,
      options: [
        "Chair",
        "Table",
        "Sofa",
        "Bed",
        "Dresser",
        "Desk",
        "Bookshelf",
        "Cabinet",
        "Other",
      ],
    },
    {
      name: "material",
      label: "What is the primary material?",
      type: "dropdown",
      required: true,
      options: [
        "Wood",
        "Metal",
        "Glass",
        "Plastic",
        "Leather",
        "Fabric",
        "Stone",
        "Composite",
        "Other",
      ],
    },
    {
      name: "age",
      label: "When was the item purchased?",
      type: "date", // Changed to date for specificity
      required: true,
    },
    {
      name: "condition",
      label: "What condition is the item in?",
      type: "dropdown",
      required: true,
      options: [
        "Brand New",
        "Excellent",
        "Good",
        "Fair",
        "Poor",
        "Needs Restoration",
      ],
    },
    {
      name: "brand",
      label: "What is the brand or manufacturer (if known)?",
      type: "text",
      required: false,
    },
    {
      name: "original_price",
      label: "Original Purchase Price ($)",
      type: "number",
      required: true,
    },
    {
      name: "planned_resale_year",
      label: "In which year are you planning to sell this item?",
      type: "dropdown", // Added a new question for planned resale year
      required: true,
      options: ["2025", "2026", "2027", "2028", "2029", "2030", "Later"],
    },
    {
      name: "description",
      label: "Please provide any additional details about the item",
      type: "textarea",
      required: false,
    },
  ],
};

export const JEWELRY_SERVICE = {
  name: "Jewelry Resale Prediction",
  description: "Get accurate resale value predictions for your jewelry items",
  icon: "💍",
  questionnaire: [
    {
      name: "photo",
      label: "Upload a photo of the jewelry",
      type: "file",
      required: true,
    },
    {
      name: "jewelry_type",
      label: "What type of jewelry is it?",
      type: "dropdown",
      required: true,
      options: ["Ring", "Necklace", "Bracelet", "Earrings", "Watch", "Other"],
    },
    {
      name: "brand",
      label: "What is the brand or manufacturer (if known)?",
      type: "text",
      required: false,
    },
    {
      name: "metal_type",
      label: "What is the primary metal type?",
      type: "dropdown",
      required: true,
      options: [
        "Gold",
        "Silver",
        "Platinum",
        "White Gold",
        "Rose Gold",
        "Stainless Steel",
        "Other",
      ],
    },
    {
      name: "metal_weight",
      label: "What is the approximate weight of the jewelry (in grams)?",
      type: "number",
      required: true,
    },
    {
      name: "age",
      label: "When was the item purchased?",
      type: "date",
      required: true,
    },
    {
      name: "condition",
      label: "What condition is the item in?",
      type: "dropdown",
      required: true,
      options: ["Brand New", "Excellent", "Good", "Fair", "Poor"],
    },
    {
      name: "original_price",
      label: "Original Purchase Price ($)",
      type: "number",
      required: true,
      hint: "Note: Resale value may depend on the current market price of gold.",
    },
    {
      name: "planned_resale_year",
      label: "In which year are you planning to sell this item?",
      type: "dropdown",
      required: true,
      options: ["2025", "2026", "2027", "2028", "2029", "2030", "Later"],
    },
    {
      name: "description",
      label: "Please provide any additional details about the item",
      type: "textarea",
      required: false,
    },
  ],
};

export const SERVICES = [FURNITURE_SERVICE, JEWELRY_SERVICE];

export enum ApplicationEnvironment {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}
