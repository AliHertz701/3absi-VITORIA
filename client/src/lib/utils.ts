import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export default function formatCurrency(amount: number) {
  // Format as Libyan Dinar with 2 decimals and thousand separator
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'LYD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
