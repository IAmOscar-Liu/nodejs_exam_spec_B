/**
 * Validates a password to ensure it meets complex security requirements.
 * - At least 8 characters long
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 *
 * @param password The password string to validate.
 * @returns {boolean} True if the password is valid, false otherwise.
 */
export function validatePassword(password: string): boolean {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  // Matches any character that is not a word character (alphanumeric and underscore) or whitespace.
  // You can customize this regex to be more or less strict.
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar
  );
}
