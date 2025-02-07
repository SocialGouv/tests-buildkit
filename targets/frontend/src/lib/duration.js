import { formatDistanceToNow, parseISO } from "date-fns";
import frLocale from "date-fns/locale/fr";

export function toMs(minutes = 0) {
  return toSecond(minutes) * 1000;
}

export function toSecond(minutes = 0) {
  return minutes * 60;
}

export function getExpiryDate(minutes = 0) {
  try {
    return new Date(Date.now() + toMs(minutes));
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const timeSince = (date) =>
  formatDistanceToNow(parseISO(date), { locale: frLocale });
