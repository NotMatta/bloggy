import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDateAgo(date) {
  const now = new Date();
  const inputDate = new Date(date);
  const diffInMs = now - inputDate;
  const diffInSeconds = Math.round(diffInMs / 1000);
  const diffInMinutes = Math.round(diffInSeconds / 60);
  const diffInHours = Math.round(diffInMinutes / 60);
  const diffInDays = Math.round(diffInHours / 24);

  if (diffInMinutes < 1) {
    return "created less than a minute ago";
  } else if (diffInMinutes < 60) {
    return `created ${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  } else if (diffInHours < 24) {
    return `created ${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  } else if (diffInDays < 7){
      return `created ${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  } else {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return `created at ${inputDate.toLocaleDateString(undefined, options)}`;
  }
}
