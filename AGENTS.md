# AGENTS.md

## Project

Salary Ticker

リアルタイムで「今この瞬間までにいくら稼いだか」を表示する Web アプリケーション。

ユーザーは以下の値を入力する。

- 月収
- 今月の稼働時間
- 出勤時刻（定時）
- 退勤時刻（定時）

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
dailyWorkingHours =
  endTime - startTime
```

## Current Earnings

```text
elapsedTime =
  currentTime - startTime
```

```text
currentEarnings =
  hourlyRate * elapsedTime
```

勤務開始前は 0 円。

勤務終了後は当日上限金額で固定する。

---

# MVP Features

## Settings

ユーザーは以下を入力できる。

- 月収
- 今月の稼働時間
- 出勤時刻
- 退勤時刻

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

# Non Goals

以下は MVP では実装しない。

- ユーザー登録
- 認証
- クラウド保存
- SNS機能
- 広告
- 課金

まずは単体アプリとして完成させることを優先する。
