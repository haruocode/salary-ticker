import { describe, expect, it } from "vitest";
import {
  breakDurationMs,
  currentEarnings,
  dailyMaxEarnings,
  dailyWorkingMs,
  elapsedWorkingMs,
  hourlyRate,
  isWorkingDay,
  remainingWorkingMs,
  timeToMs,
  workProgress,
} from "./calc";
import type { Settings } from "./settings";

// 月収 32万 / 稼働 160h → 時給 2,000円。9:00-18:00 勤務、12:00-13:00 休憩（実働 8h）
const settings: Settings = {
  monthlySalary: 320000,
  monthlyWorkingHours: 160,
  startTime: "09:00",
  endTime: "18:00",
  breakStartTime: "12:00",
  breakEndTime: "13:00",
};

// 2026-06-10 は水曜日
const weekday = (time: string) => new Date(`2026-06-10T${time}:00`);

describe("timeToMs", () => {
  it("HH:MM をミリ秒に変換する", () => {
    expect(timeToMs("00:00")).toBe(0);
    expect(timeToMs("09:30")).toBe(9.5 * 3_600_000);
  });
});

describe("isWorkingDay", () => {
  it("平日は勤務日", () => {
    expect(isWorkingDay(new Date("2026-06-10T12:00:00"))).toBe(true);
  });
  it("土日は勤務日でない", () => {
    expect(isWorkingDay(new Date("2026-06-13T12:00:00"))).toBe(false);
    expect(isWorkingDay(new Date("2026-06-14T12:00:00"))).toBe(false);
  });
});

describe("基本量", () => {
  it("時給 = 月収 / 稼働時間", () => {
    expect(hourlyRate(settings)).toBe(2000);
  });
  it("休憩は 1 時間", () => {
    expect(breakDurationMs(settings)).toBe(3_600_000);
  });
  it("実働は 8 時間", () => {
    expect(dailyWorkingMs(settings)).toBe(8 * 3_600_000);
  });
  it("当日上限は 16,000 円", () => {
    expect(dailyMaxEarnings(settings)).toBe(16000);
  });
});

describe("elapsedWorkingMs", () => {
  it("勤務開始前は 0", () => {
    expect(elapsedWorkingMs(settings, weekday("08:00"))).toBe(0);
  });
  it("午前中は出勤からの経過時間そのまま", () => {
    expect(elapsedWorkingMs(settings, weekday("10:30"))).toBe(1.5 * 3_600_000);
  });
  it("休憩中はカウントが停止する", () => {
    expect(elapsedWorkingMs(settings, weekday("12:00"))).toBe(3 * 3_600_000);
    expect(elapsedWorkingMs(settings, weekday("12:30"))).toBe(3 * 3_600_000);
    expect(elapsedWorkingMs(settings, weekday("13:00"))).toBe(3 * 3_600_000);
  });
  it("休憩後は休憩分を除いて再開する", () => {
    expect(elapsedWorkingMs(settings, weekday("15:00"))).toBe(5 * 3_600_000);
  });
  it("勤務終了後は実働時間で固定", () => {
    expect(elapsedWorkingMs(settings, weekday("18:00"))).toBe(8 * 3_600_000);
    expect(elapsedWorkingMs(settings, weekday("23:00"))).toBe(8 * 3_600_000);
  });
  it("土日は常に 0", () => {
    expect(elapsedWorkingMs(settings, new Date("2026-06-13T12:00:00"))).toBe(0);
  });
});

describe("currentEarnings", () => {
  it("勤務開始前は 0 円", () => {
    expect(currentEarnings(settings, weekday("08:59"))).toBe(0);
  });
  it("午前 10:30 で 3,000 円", () => {
    expect(currentEarnings(settings, weekday("10:30"))).toBe(3000);
  });
  it("勤務終了後は当日上限で固定", () => {
    expect(currentEarnings(settings, weekday("20:00"))).toBe(16000);
  });
  it("土日は 0 円", () => {
    expect(currentEarnings(settings, new Date("2026-06-14T12:00:00"))).toBe(0);
  });
});

describe("workProgress / remainingWorkingMs", () => {
  it("15:00 時点で進捗 62.5%、残り 3 時間", () => {
    expect(workProgress(settings, weekday("15:00"))).toBe(0.625);
    expect(remainingWorkingMs(settings, weekday("15:00"))).toBe(3 * 3_600_000);
  });
  it("土日は進捗 0%、残り 0", () => {
    const sat = new Date("2026-06-13T15:00:00");
    expect(workProgress(settings, sat)).toBe(0);
    expect(remainingWorkingMs(settings, sat)).toBe(0);
  });
});
