export type SignalOsTier = {
  id: "solo" | "agency" | "studio";
  name: string;
  price: string;
  priceAmount: string;
  fit: string;
};

export type SignalOsPageProps = {
  foundingActive: boolean;
  productJsonLd: string;
};
