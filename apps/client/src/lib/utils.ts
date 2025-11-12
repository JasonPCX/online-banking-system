import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function base64UrlDecode(input: any) {
  // Replace non-url compatible chars with base64 standard chars
  let base64String = input.replace(/-/g, '+').replace(/_/g, '/');

  // Pad out with standard base64 required padding characters
  const padLength = 4 - (base64String.length % 4);
  if (padLength < 4) {
    for (let i = 0; i < padLength; i++) {
      base64String += '=';
    }
  }

  const base64 = window.atob(base64String);

  return JSON.parse(decodeURIComponent(escape(base64)));
}

// Money formatting utility using Intl.NumberFormat
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount: number | string | null | undefined): string {
  const numericAmount = parseFloat(amount?.toString() || '0');
  return currencyFormatter.format(numericAmount);
}