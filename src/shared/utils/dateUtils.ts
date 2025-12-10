export const getDaysRemaining = (expiresAt: string | null): string => {
  if (!expiresAt) return "Бессрочно";

  const now = new Date();
  const expiryDate = new Date(expiresAt);
  const diffTime = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Истёк";
  if (diffDays === 1) return "1 день";
  if (diffDays < 5) return `${diffDays} дня`;
  return `${diffDays} дней`;
};
