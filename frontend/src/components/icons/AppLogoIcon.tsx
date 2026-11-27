type IconProps = {
  size?: number
}

// 파비콘과 같은 앱 로고. VSCode 리본 느낌을 살리되 모양은 다르게 그렸다
export function AppLogoIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M22 3 L29 6.5 V25.5 L22 29 Z" fill="#3aa0f0" />
      <path
        d="M22 3 V29 L9 18.5 L5 21.5 L3 20 V12 L5 10.5 L9 13.5 Z"
        fill="#0b6fc4"
      />
      <path d="M22 9.5 V22.5 L13.5 16 Z" fill="#1f1f1f" />
    </svg>
  )
}
