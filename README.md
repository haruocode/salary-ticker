# Salary Ticker

リアルタイムで「今この瞬間までにいくら稼いだか」を表示する Web アプリ。

「あと何時間働くか」ではなく「今いくら稼いだか」を可視化して、働くモチベーションを高めます。

## 機能

- **現在の獲得額** — 出勤時刻からの実働時間 × 時給を 100ms ごとに更新して表示
- **時給 / 分給 / 秒給** — 月収と稼働時間から自動計算
- **勤務進捗** — 進捗率と残り勤務時間をプログレスバーで表示
- 休憩時間中はカウント停止
- 勤務開始前は ¥0、勤務終了後は当日上限で固定
- 土日はカウントしない

設定(月収・今月の稼働時間・出退勤時刻・休憩時間)は localStorage に保存されます。サーバー不要、すべてクライアントサイドで完結します。

## 使い方

```bash
pnpm install
pnpm dev
```

初回アクセス時に設定画面が表示されます。月収などを入力して保存するとダッシュボードが表示されます。

## 開発

```bash
pnpm build         # 型チェック + プロダクションビルド
pnpm test          # ユニットテスト（Vitest）
pnpm lint          # oxlint
pnpm format        # oxfmt
```

## デプロイ

Cloudflare Workers（静的アセット）にデプロイしています。

```bash
pnpm run deploy    # ビルドして wrangler deploy
```

公開 URL: https://salary-ticker.takaron0930.workers.dev

## 技術スタック

- React + TypeScript + Vite
- Tailwind CSS
- oxlint / oxfmt
- Vitest

詳しい仕様は [AGENTS.md](AGENTS.md) を参照してください。
