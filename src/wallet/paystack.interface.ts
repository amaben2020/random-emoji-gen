// Types for Paystack webhook response
interface PaystackAuthorization {
  authorization_code: string;
  bin: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  card_type: string;
  bank: string;
  country_code: string;
  brand: string;
}

interface PaystackCustomer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  customer_code: string;
  phone: string | null;
  metadata: any;
  risk_action: string;
}

interface PaystackLog {
  time_spent: number;
  attempts: number;
  authentication: string;
  errors: number;
  success: boolean;
  mobile: boolean;
  input: any[];
  channel: string | null;
  history: any[];
}

export interface PaystackPaymentData {
  id: number;
  domain: string;
  status: string;
  reference: string;
  amount: number;
  message: string | null;
  gateway_response: string;
  paid_at: string;
  created_at: string;
  channel: string;
  currency: string;
  ip_address: string;
  metadata: PaymentDetails;
  log: PaystackLog;
  fees: any;
  customer: PaystackCustomer;
  authorization: PaystackAuthorization;
  plan: Record<string, any>;
}

export interface PaystackWebhookBody {
  event: string;
  data: PaystackPaymentData;
}

// User and Wallet types
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  posts?: any;
  role: string;
  accountNumber: string;
  type: string;
  wallet?: Wallet;
  isVerified: boolean;
}

interface Wallet {
  id: number;
  balance: string | number;
  user?: User;
  accountNumber: string;
  currency: string;
  createdAt: string;
  ref: string;
}

// Payment details interface
interface PaymentDetails {
  reference: string;
  amount: number;
  customerEmail: string;
  paidAt: Date;
  metadata: any;
}
