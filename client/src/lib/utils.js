import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Συνένωση/συγχώνευση Tailwind classes */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
