import { format } from "date-fns";

/**
 * Formats a date string to MM/dd/yyyy format
 * @param dateString - ISO datetime string
 * @returns Formatted date string or original string if parsing fails
 */
export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), "MM/dd/yyyy");
  } catch {
    return dateString;
  }
};

/**
 * Formats a date string to hh:mm a format (12-hour with AM/PM)
 * @param dateString - ISO datetime string
 * @returns Formatted time string or original string if parsing fails
 */
export const formatTime = (dateString: string): string => {
  try {
    return format(new Date(dateString), "hh:mm a");
  } catch {
    return dateString;
  }
};
