export function formatDuration(ms?: number | null) {
  const safeMs = Math.max(ms ?? 0, 0);
  const totalMinutes = Math.floor(safeMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}
