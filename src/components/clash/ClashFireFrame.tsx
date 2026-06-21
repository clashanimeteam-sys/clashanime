export function getClashVideoBackdropClass(rank: number): string {
  if (rank === 1) {
    return "bg-gradient-to-br from-amber-400 via-orange-500 to-red-600";
  }
  if (rank === 2) {
    return "bg-gradient-to-br from-slate-300 via-orange-400 to-red-500";
  }
  if (rank === 3) {
    return "bg-gradient-to-br from-orange-500 via-amber-600 to-red-700";
  }
  return "bg-gradient-to-br from-red-900 via-orange-950 to-amber-950";
}
