import { useNow } from "../hooks/useNow";
import {
  currentEarnings,
  hourlyRate,
  isWorkingDay,
  remainingWorkingMs,
  workProgress,
} from "../lib/calc";
import { formatDuration, formatEarnings, formatYen, formatYen2, formatYen4 } from "../lib/format";
import type { Settings } from "../lib/settings";

interface Props {
  settings: Settings;
  onEdit: () => void;
}

export function Dashboard({ settings, onEdit }: Props) {
  const now = useNow(100);

  const earnings = currentEarnings(settings, now);
  const rate = hourlyRate(settings);
  const progress = workProgress(settings, now);
  const remaining = remainingWorkingMs(settings, now);
  const workingDay = isWorkingDay(now);

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-10">
      <section className="text-center">
        <p className="mb-2 text-sm tracking-widest text-zinc-500">
          {workingDay ? "今日ここまでの獲得額" : "今日はお休み"}
        </p>
        <p className="font-mono text-6xl font-bold tabular-nums text-emerald-400 sm:text-7xl">
          {formatEarnings(earnings)}
        </p>
      </section>

      <section className="grid w-full grid-cols-3 gap-4 text-center">
        <div className="rounded-xl bg-zinc-900 px-4 py-5">
          <p className="mb-1 text-xs text-zinc-500">時給</p>
          <p className="font-mono text-lg tabular-nums text-zinc-100">{formatYen(rate)} / h</p>
        </div>
        <div className="rounded-xl bg-zinc-900 px-4 py-5">
          <p className="mb-1 text-xs text-zinc-500">分給</p>
          <p className="font-mono text-lg tabular-nums text-zinc-100">
            {formatYen2(rate / 60)} / min
          </p>
        </div>
        <div className="rounded-xl bg-zinc-900 px-4 py-5">
          <p className="mb-1 text-xs text-zinc-500">秒給</p>
          <p className="font-mono text-lg tabular-nums text-zinc-100">
            {formatYen4(rate / 3600)} / sec
          </p>
        </div>
      </section>

      {workingDay && (
        <section className="w-full">
          <div className="mb-2 flex items-baseline justify-between text-sm text-zinc-400">
            <span>勤務進捗 {Math.floor(progress * 100)}%</span>
            <span>{remaining > 0 ? `あと ${formatDuration(remaining)}` : "本日の勤務終了"}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-[width]"
              style={{ width: `${Math.min(progress, 1) * 100}%` }}
            />
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={onEdit}
        className="text-sm text-zinc-500 underline-offset-4 hover:text-zinc-300 hover:underline"
      >
        設定を変更
      </button>
    </div>
  );
}
