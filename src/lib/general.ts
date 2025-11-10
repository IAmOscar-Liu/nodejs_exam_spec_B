import { Response } from "express";
import { ServiceResponse } from "../type/general";

export function sendJsonResponse<T>(res: Response, result: ServiceResponse<T>) {
  res.status(result.statusCode ?? 200).json(result);
}

/**
 * Validates if a string is a UUID.
 * @param uuid The string to validate.
 * @returns {boolean} True if the string is a valid UUID, false otherwise.
 */
export function isUUID(uuid: string): boolean {
  if (!uuid) return false;
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(uuid);
}
