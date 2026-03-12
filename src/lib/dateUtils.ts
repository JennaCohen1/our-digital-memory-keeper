const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatMemoryDate(date?: string): string | null {
  if (!date) return null;
  // "2024-03" → "March 2024", "1983" → "1983"
  const parts = date.split("-");
  if (parts.length === 2) {
    const monthIndex = parseInt(parts[1], 10) - 1;
    return `${months[monthIndex]} ${parts[0]}`;
  }
  return parts[0];
}
