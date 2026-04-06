export type TailOption =
  | "Include — standard with notice requirement (recommended)"
  | "Include — with termination for cause exception"
  | "Waive — by written agreement only"
  | "";

export type RetainerMethod = "Wire Transfer" | "ACH" | "Check";

export interface ELData {
  s_company: string;
  s_ref: string;
  s_date: string;
  state: string;
  officer_name: string;
  officer_title: string;
  company_email: string;
  retainer_date: string;
  retainer_method: RetainerMethod;
  ack_retainer: boolean;
  ev: string;
  ev_source: string;
  ack_fee: boolean;
  tax_struct: string;
  emp_count: string;
  erisa_elig: string;
  other_loi: string;
  ack_reps: boolean;
  has_broker: "yes" | "no" | "";
  broker_name: string;
  broker_firm: string;
  broker_email: string;
  gov_law: string;
  venue_county: string;
  tail: TailOption;
  exclusivity: string;
  special_terms: string;
  ack_arbitration: boolean;
  ack_liability: boolean;
  ack_indemnity: boolean;
  fhm_signer: string;
  fhm_title: string;
  ack_final: boolean;
}
