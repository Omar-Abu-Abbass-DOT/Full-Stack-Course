import mongoose from "mongoose";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value) {
  return typeof value === "string" && EMAIL_REGEX.test(value);
}

export function isValidObjectId(value) {
  return typeof value === "string" && mongoose.isValidObjectId(value);
}

export function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function isFiniteNumber(value) {
  // Reject null/undefined/empty — Number(null) is 0, which made callers treat
  // missing query params as "0" and break price-range filters.
  if (value === null || value === undefined || value === "") return false;
  const n = Number(value);
  return Number.isFinite(n);
}

export function isFutureDate(value) {
  const d = new Date(value);
  return !isNaN(d.getTime()) && d.getTime() > Date.now();
}

export function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const BOOKING_STATUSES = ["pending", "accepted", "completed", "cancelled"];
export const ROLES = ["customer", "provider", "admin"];
export const PUBLIC_ROLES = ["customer", "provider"];
