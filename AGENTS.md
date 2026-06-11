# AGENTS.md

## Project

Salary Ticker

リアルタイムで「今この瞬間までにいくら稼いだか」を表示する Web アプリケーション。

ユーザーは以下の値を入力する。

- 月収
- 今月の稼働時間
- 出勤時刻（定時）
- 退勤時刻（定時）
- 休憩開始時刻
- 休憩終了時刻

アプリは現在時刻を元に、その日の推定収益をリアルタイムに計算して表示する。

---

# Goal

ユーザーが働くモチベーションを高めること。

「あと何時間働くか」ではなく、

「今いくら稼いだか」

を可視化する。

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- pnpm

## Styling

- Tailwind CSS

## Quality

- oxlint
- oxfmt

## Storage

- localStorage

サーバーは不要。

すべてクライアントサイドで完結する。

---

# Core Calculation

## Hourly Rate

```text
hourlyRate = monthlySalary / monthlyWorkingHours
```

## Daily Working Hours

```text
breakDuration =
  breakEndTime - breakStartTime
```

```text
dailyWorkingHours =
  (endTime - startTime) - breakDuration
```

## Current Earnings

```text
elapsedBreakTime =
  [breakStartTime, breakEndTime] と [startTime, currentTime] の重なり時間
```

```text
elapsedTime =
  (currentTime - startTime) - elapsedBreakTime
```

```text
currentEarnings =
  hourlyRate * elapsedTime
```

勤務開始前は 0 円。

休憩中はカウントが停止する（獲得額は増えない）。

勤務終了後は当日上限金額で固定する。

## Working Days

土日は勤務日としない。

土日にページを開いた場合、獲得額は ¥0 のまま計測しない。

---

# MVP Features

## Settings

ユーザーは以下を入力できる。

- 月収
- 今月の稼働時間
- 出勤時刻
- 退勤時刻
- 休憩開始時刻
- 休憩終了時刻

設定は localStorage に保存する。

---

## Dashboard

表示内容

### 現在の獲得額

```text
¥18,562.43
```

100ms ごとに更新する。

---

### 時給

```text
¥4,125 / h
```

---

### 分給

```text
¥68.75 / min
```

---

### 秒給

```text
¥1.1458 / sec
```

---

### 勤務進捗率

```text
80%
```

---

### 残り勤務時間

```text
あと 1時間42分
```

---

# Future Features

## Earnings History

日ごとの収益履歴

---

## Monthly Statistics

- 推定月収
- 総勤務時間
- 平均時給

---

## Meeting Mode

開始ボタンを押すと計測開始。

```text
この会議で稼いだ金額
```

を表示する。

---

## Freelance Mode

固定月収ではなく

```text
案件単価
↓
時給換算
```

で計算する。

---

## FIRE Mode

資産所得を加算する。

```text
働いて稼いだ金額
+
資産が稼いだ金額
```

を表示する。

---

# UI Principles

シンプル。

数字を主役にする。

不要な装飾は避ける。

最も大きく表示するのは

```text
現在の獲得額
```

のみ。

ユーザーがページを開いた瞬間に

「今いくら稼いだか」

が理解できることを最優先とする。

---

# Development

```bash
pnpm dev          # 開発サーバー起動
pnpm build        # 型チェック + プロダクションビルド
pnpm test         # ユニットテスト（Vitest）
pnpm lint         # oxlint
pnpm format       # oxfmt
```

## Structure

- `src/lib/` — 計算ロジック・設定の永続化（純粋関数。テスト対象）
- `src/hooks/` — React フック
- `src/components/` — UI コンポーネント

計算ロジックは `src/lib/calc.ts` に集約し、UI から分離する。

---

# Non Goals

以下は MVP では実装しない。

- ユーザー登録
- 認証
- クラウド保存
- SNS機能
- 広告
- 課金
- 夜勤対応（日をまたぐ勤務。endTime は startTime より後である前提）
- 祝日カレンダー対応（土日のみを非勤務日とする）

まずは単体アプリとして完成させることを優先する。
