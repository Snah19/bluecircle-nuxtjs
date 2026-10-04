type DateInput = Date | string | number;

export const formatRelativeTime = (date: DateInput, now: Date = new Date()): string => {
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  // Guard against future dates (e.g. clock drift) and invalid input
  if (Number.isNaN(seconds) || seconds < 5) return "now";

  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;

  // Older posts: show a short date, adding the year only if it's not this year
  const sameYear = then.getFullYear() === now.getFullYear();
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  };

  return then.toLocaleDateString("en-US", options);
};