type IconProps = {
  color: string
}

// .jsx·.tsx 파일 아이콘. 글꼴에 ⚛ 글자가 없어서 직접 그린 원자 모양
export function ReactFileIcon({ color }: IconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke={color}
      aria-hidden="true"
    >
      <ellipse cx="8" cy="8" rx="7" ry="2.7" />
      <ellipse cx="8" cy="8" rx="7" ry="2.7" transform="rotate(60 8 8)" />
      <ellipse cx="8" cy="8" rx="7" ry="2.7" transform="rotate(120 8 8)" />
      <circle cx="8" cy="8" r="1.3" fill={color} stroke="none" />
    </svg>
  )
}
