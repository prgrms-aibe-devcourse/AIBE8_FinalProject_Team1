type IconProps = {
  size?: number
}

// Codex 버튼 아이콘. 로고를 그대로 쓰지 않고 구름 안에 터미널 프롬프트(>_)를 그렸다
export function CodexIcon({ size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 13 H11.5 A3 3 0 0 0 12 7 A4 4 0 0 0 4.3 6.2 A3.4 3.4 0 0 0 4.5 13 Z" />
      <path d="M6 8.8 L7.5 10 L6 11.2" />
      <path d="M8.5 11.2 H10.2" />
    </svg>
  )
}
