/**
 * Validation utilities for HeliosHash DAO
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePrincipal = (principal: string): boolean => {
  // Basic principal validation - can be enhanced
  return principal.length > 0 && !principal.includes(' ');
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
