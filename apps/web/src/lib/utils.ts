import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export function toTitleCase(s: string) {
  return s.replace(/(^|\s)\S/g, (t) => t.toUpperCase());
}

export default { cn, toTitleCase };
