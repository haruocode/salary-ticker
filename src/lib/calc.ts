import type { Settings } from "./settings";

const MS_PER_HOUR = 3_600_000;
const MS_PER_MINUTE = 60_000;

/** "HH:MM" をその日の 0:00 からのミリ秒に変換する */
export function timeToMs(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours * 60 + minutes) * MS_PER_MINUTE;
}

/** 土日は勤務日としない */
export function isWorkingDay(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

/** 時給（円/時） */
export function hourlyRate(settings: Settings): number {
  return settings.monthlySalary / settings.monthlyWorkingHours;
}

/** 休憩時間（ミリ秒） */
export function breakDurationMs(settings: Settings): number {
  return Math.max(0, timeToMs(settings.breakEndTime) - timeToMs(settings.breakStartTime));
}

/** 1日の実働時間（ミリ秒）。休憩を除く */
export function dailyWorkingMs(settings: Settings): number {
  const total = timeToMs(settings.endTime) - timeToMs(settings.startTime);
  return Math.max(0, total - breakDurationMs(settings));
}

/** 2つの区間 [aStart, aEnd] と [bStart, bEnd] の重なり（ミリ秒） */
function overlapMs(aStart: number, aEnd: number, bStart: number, bEnd: number): number {
  return Math.max(0, Math.min(aEnd, bEnd) - Math.max(aStart, bStart));
}

/**
 * 現在時刻までの実働経過時間（ミリ秒）。
 * 休憩中はカウントが停止する。勤務開始前は 0、勤務終了後は上限で固定。
 * 土日は常に 0。
 */
export function elapsedWorkingMs(settings: Settings, now: Date): number {
  if (!isWorkingDay(now)) return 0;

  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const nowMs = now.getTime() - midnight.getTime();

  const start = timeToMs(settings.startTime);
  const end = timeToMs(settings.endTime);
  const clamped = Math.min(Math.max(nowMs, start), end);

  const gross = clamped - start;
  const breakElapsed = overlapMs(
    timeToMs(settings.breakStartTime),
    timeToMs(settings.breakEndTime),
    start,
    clamped,
  );
  return Math.max(0, gross - breakElapsed);
}

/** 現在の獲得額（円） */
export function currentEarnings(settings: Settings, now: Date): number {
  return (hourlyRate(settings) * elapsedWorkingMs(settings, now)) / MS_PER_HOUR;
}

/** 当日の上限金額（円） */
export function dailyMaxEarnings(settings: Settings): number {
  return (hourlyRate(settings) * dailyWorkingMs(settings)) / MS_PER_HOUR;
}

/** 勤務進捗率（0〜1） */
export function workProgress(settings: Settings, now: Date): number {
  const total = dailyWorkingMs(settings);
  if (total === 0) return 0;
  return elapsedWorkingMs(settings, now) / total;
}

/** 残り実働時間（ミリ秒） */
export function remainingWorkingMs(settings: Settings, now: Date): number {
  if (!isWorkingDay(now)) return 0;
  return dailyWorkingMs(settings) - elapsedWorkingMs(settings, now);
}
