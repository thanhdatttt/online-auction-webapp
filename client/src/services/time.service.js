import { intervalToDuration, isPast } from 'date-fns';

export const getFormattedTimeDiff = (endDate, currentTime = new Date()) => {
  const end = new Date(endDate);

  if (isPast(end)) {
    return -1;
  }

  const duration = intervalToDuration({
    start: currentTime,
    end: end,
  });

  const parts = [];
  if (duration.years > 0) parts.push(`${duration.years}y`);
  if (duration.months > 0) parts.push(`${duration.months}m`);
  if (duration.days > 0) parts.push(`${duration.days}d`);
  if (duration.hours > 0) parts.push(`${duration.hours}h`);
  if (duration.minutes > 0) parts.push(`${duration.minutes}m`);
  if (duration.seconds > 0) parts.push(`${duration.seconds}s`);

  if (parts.length === 0) return null;

  return `${parts.slice(0, 3).join(' ')}`;
};

export const getRelativeTime = (startDate, currentTime = new Date()) => {
  const date = new Date(startDate);
  const diffInSeconds = Math.floor((currentTime - date) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} days ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} months ago`;

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} years ago`;
};

export const getRelativeTimeNoFormat = (startDate, currentTime = new Date()) => {
  const date = new Date(startDate);
  return Math.floor((currentTime - date) / 1000);
};