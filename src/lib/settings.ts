export interface Settings {
  /** 月収（円） */
  monthlySalary: number;
  /** 今月の稼働時間（時間） */
  monthlyWorkingHours: number;
  /** 出勤時刻 "HH:MM" */
  startTime: string;
  /** 退勤時刻 "HH:MM" */
  endTime: string;
  /** 休憩開始時刻 "HH:MM" */
  breakStartTime: string;
  /** 休憩終了時刻 "HH:MM" */
  breakEndTime: string;
}

export const DEFAULT_SETTINGS: Settings = {
  monthlySalary: 300000,
  monthlyWorkingHours: 160,
  startTime: "09:00",
  endTime: "18:00",
  breakStartTime: "12:00",
  breakEndTime: "13:00",
};

const STORAGE_KEY = "salary-ticker:settings";

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export function isValidSettings(value: unknown): value is Settings {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.monthlySalary === "number" &&
    v.monthlySalary > 0 &&
    typeof v.monthlyWorkingHours === "number" &&
    v.monthlyWorkingHours > 0 &&
    typeof v.startTime === "string" &&
    TIME_PATTERN.test(v.startTime) &&
    typeof v.endTime === "string" &&
    TIME_PATTERN.test(v.endTime) &&
    typeof v.breakStartTime === "string" &&
    TIME_PATTERN.test(v.breakStartTime) &&
    typeof v.breakEndTime === "string" &&
    TIME_PATTERN.test(v.breakEndTime)
  );
}

export function loadSettings(): Settings | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    return isValidSettings(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
