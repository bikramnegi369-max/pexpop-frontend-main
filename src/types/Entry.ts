export default interface EntryInputs {
  name: string;
  sale1: number | null;
  rate1: number | null;
  sale2: number | null;
  rate2: number | null;
  sale3: number | null;
  rate3: number | null;
  total_sale_usd: number;
  total_sale_inr: number;
  agent_commission: number;
  costing_inr: number;
  profit: number;
  payment_status: string;
}
