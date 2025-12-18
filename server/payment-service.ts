import { ENV } from "./_core/env";

/**
 * Paystack Payment Integration Service
 * Handles payment initialization, verification, and webhooks
 */

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY || "";
const PAYSTACK_BASE_URL = "https://api.paystack.co";

interface PaymentInitData {
  email: string;
  amount: number; // in kobo (cents)
  reference: string;
  callback_url?: string;
  metadata?: Record<string, any>;
  channels?: string[];
}

interface PaymentVerifyResponse {
  status: boolean;
  message: string;
  data: {
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
    metadata: Record<string, any>;
    fees: number;
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      phone: string | null;
    };
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
    };
  };
}

/**
 * Initialize a payment transaction
 */
export async function initializePayment(data: PaymentInitData): Promise<{
  success: boolean;
  authorization_url?: string;
  access_code?: string;
  reference: string;
  error?: string;
}> {
  try {
    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.status) {
      return {
        success: false,
        reference: data.reference,
        error: result.message || "Payment initialization failed",
      };
    }

    return {
      success: true,
      authorization_url: result.data.authorization_url,
      access_code: result.data.access_code,
      reference: result.data.reference,
    };
  } catch (error) {
    console.error("Payment initialization error:", error);
    return {
      success: false,
      reference: data.reference,
      error: "Network error during payment initialization",
    };
  }
}

/**
 * Verify a payment transaction
 */
export async function verifyPayment(reference: string): Promise<{
  success: boolean;
  data?: PaymentVerifyResponse["data"];
  error?: string;
}> {
  try {
    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const result: PaymentVerifyResponse = await response.json();

    if (!response.ok || !result.status) {
      return {
        success: false,
        error: result.message || "Payment verification failed",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Payment verification error:", error);
    return {
      success: false,
      error: "Network error during payment verification",
    };
  }
}

/**
 * Process refund for a transaction
 */
export async function processRefund(
  transactionReference: string,
  amount?: number,
  merchantNote?: string
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const payload: any = {
      transaction: transactionReference,
    };

    if (amount) {
      payload.amount = amount;
    }

    if (merchantNote) {
      payload.merchant_note = merchantNote;
    }

    const response = await fetch(`${PAYSTACK_BASE_URL}/refund`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.status) {
      return {
        success: false,
        error: result.message || "Refund processing failed",
      };
    }

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    console.error("Refund processing error:", error);
    return {
      success: false,
      error: "Network error during refund processing",
    };
  }
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(payload: string, signature: string): boolean {
  const crypto = require("crypto");
  const hash = crypto.createHmac("sha512", PAYSTACK_SECRET_KEY).update(payload).digest("hex");
  return hash === signature;
}

/**
 * Get Paystack public key for frontend
 */
export function getPaystackPublicKey(): string {
  return PAYSTACK_PUBLIC_KEY;
}

/**
 * Generate unique payment reference
 */
export function generatePaymentReference(prefix: string = "OWB"): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Calculate platform fee (for split payments)
 */
export function calculatePlatformFee(amount: number, feePercentage: number = 10): number {
  return Math.floor((amount * feePercentage) / 100);
}

/**
 * Format amount to kobo (Paystack uses kobo, not naira)
 */
export function toKobo(naira: number): number {
  return Math.floor(naira * 100);
}

/**
 * Format amount from kobo to naira
 */
export function fromKobo(kobo: number): number {
  return kobo / 100;
}

