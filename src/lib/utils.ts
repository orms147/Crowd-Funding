import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'

// Shorten address function
export function shortenAddress(address?: string | number): string {
    if (!address) return "";
  
    const str = String(address); 
    const start = str.substring(0, 6);
    const end = str.substring(str.length - 4);
  
    return `${start}...${end}`;
  }
  

//Merge tailwind
export function cn(...classNames: string[]) {
    return twMerge(clsx(...classNames));
}