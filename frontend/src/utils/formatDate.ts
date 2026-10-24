import { formatDistanceToNowStrict, format, isToday, isYesterday } from 'date-fns';

export function formatPostDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const diffSeconds = (Date.now() - date.getTime()) / 1000;
    if (diffSeconds < 60) return 'just now';

    const distance = formatDistanceToNowStrict(date, { addSuffix: false });
    // Convert e.g. "5 minutes" to "5m", "2 hours" to "2h", "3 days" to "3d"
    return distance
      .replace(' seconds', 's')
      .replace(' second', 's')
      .replace(' minutes', 'm')
      .replace(' minute', 'm')
      .replace(' hours', 'h')
      .replace(' hour', 'h')
      .replace(' days', 'd')
      .replace(' day', 'd')
      .replace(' months', 'mo')
      .replace(' month', 'mo')
      .replace(' years', 'y')
      .replace(' year', 'y');
  } catch {
    return '';
  }
}

export function formatFullDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return format(date, 'h:mm a · MMM d, yyyy');
  } catch {
    return dateString;
  }
}

export function formatJoinDate(dateString?: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return `Joined ${format(date, 'MMMM yyyy')}`;
  } catch {
    return '';
  }
}
