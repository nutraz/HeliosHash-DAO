export const formatOWP = (amount: string | number): string => {
  // Simple formatting for OWP tokens - can be extended for internationalization
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `${numAmount.toLocaleString()} OWP`;
};

export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatINR = (amount: number): string => {
  return formatCurrency(amount, 'INR');
};
