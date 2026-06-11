import { useState } from "react";
import { timeToMs } from "../lib/calc";
import type { Settings } from "../lib/settings";

interface Props {
  initial: Settings;
  onSave: (settings: Settings) => void;
  onCancel?: () => void;
}

export function SettingsForm({ initial, onSave, onCancel }: Props) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (): string | null => {
    if (!(form.monthlySalary > 0)) return "月収は 1 円以上で入力してください";
    if (!(form.monthlyWorkingHours > 0)) return "稼働時間は 1 時間以上で入力してください";
    if (timeToMs(form.endTime) <= timeToMs(form.startTime)) {
      return "退勤時刻は出勤時刻より後にしてください";
    }
    if (timeToMs(form.breakEndTime) < timeToMs(form.breakStartTime)) {
      return "休憩終了時刻は休憩開始時刻以降にしてください";
    }
    if (
      timeToMs(form.breakStartTime) < timeToMs(form.startTime) ||
      timeToMs(form.breakEndTime) > timeToMs(form.endTime)
    ) {
      return "休憩時間は勤務時間内に収めてください";
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = validate();
    if (message !== null) {
      setError(message);
      return;
    }
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-sm flex-col gap-5">
      <h1 className="text-xl font-bold text-zinc-100">設定</h1>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-zinc-400">月収（円）</span>
        <input
          type="number"
          min="1"
          required
          value={form.monthlySalary || ""}
          onChange={(e) => set("monthlySalary", e.target.valueAsNumber)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-emerald-500 focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-zinc-400">今月の稼働時間（時間）</span>
        <input
          type="number"
          min="1"
          required
          value={form.monthlyWorkingHours || ""}
          onChange={(e) => set("monthlyWorkingHours", e.target.valueAsNumber)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-emerald-500 focus:outline-none"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-zinc-400">出勤時刻</span>
          <input
            type="time"
            required
            value={form.startTime}
            onChange={(e) => set("startTime", e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-emerald-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-zinc-400">退勤時刻</span>
          <input
            type="time"
            required
            value={form.endTime}
            onChange={(e) => set("endTime", e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-emerald-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-zinc-400">休憩開始</span>
          <input
            type="time"
            required
            value={form.breakStartTime}
            onChange={(e) => set("breakStartTime", e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-emerald-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-zinc-400">休憩終了</span>
          <input
            type="time"
            required
            value={form.breakEndTime}
            onChange={(e) => set("breakEndTime", e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-emerald-500 focus:outline-none"
          />
        </label>
      </div>

      {error !== null && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 font-bold text-white hover:bg-emerald-500"
        >
          保存
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-zinc-300 hover:bg-zinc-800"
          >
            キャンセル
          </button>
        )}
      </div>
    </form>
  );
}
