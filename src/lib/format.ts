/** ¥18,562.43 形式（小数2桁固定） */
export function formatEarnings(yen: number): string {
  return `¥${yen.toLocaleString("ja-JP", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** ¥4,125 形式（整数） */
export function formatYen(yen: number): string {
  return `¥${Math.round(yen).toLocaleString("ja-JP")}`;
}

/** ¥68.75 形式（小数2桁） */
export function formatYen2(yen: number): string {
  return `¥${yen.toLocaleString("ja-JP", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** ¥1.1458 形式（小数4桁） */
export function formatYen4(yen: number): string {
  return `¥${yen.toLocaleString("ja-JP", { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
}

/** 「あと 1時間42分」の時間部分 */
export function formatDuration(ms: number): string {
  const totalMinutes = Math.ceil(ms / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}分`;
  return `${hours}時間${minutes}分`;
}
