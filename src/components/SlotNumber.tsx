const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/** 0〜9 を縦に並べ、対象の数字まで translateY でロールする1桁分のリール */
function SlotDigit({ digit }: { digit: number }) {
  return (
    <span className="inline-block overflow-hidden" style={{ height: "1em" }}>
      <span
        className="block transition-transform duration-200 ease-out motion-reduce:transition-none"
        style={{ transform: `translateY(${-digit}em)` }}
      >
        {DIGITS.map((d) => (
          <span key={d} className="block" style={{ height: "1em" }}>
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

interface Props {
  /** 表示する文字列（例: "¥18,562.43"）。数字以外の文字はそのまま表示する */
  value: string;
}

/** 数字がスロットのように縦にロールするカウンター表示 */
export function SlotNumber({ value }: Props) {
  const chars = value.split("");
  return (
    <span className="inline-flex leading-none" aria-label={value}>
      {chars.map((char, i) => {
        // 桁が増えても既存のリールが右端からの位置で同一性を保つよう、右からの位置をキーにする
        const key = chars.length - i;
        return /\d/.test(char) ? (
          <SlotDigit key={key} digit={Number(char)} />
        ) : (
          <span key={`s${key}`} className="inline-block" style={{ height: "1em" }}>
            {char}
          </span>
        );
      })}
    </span>
  );
}
