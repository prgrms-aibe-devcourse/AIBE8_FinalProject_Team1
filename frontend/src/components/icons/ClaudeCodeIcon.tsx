type IconProps = {
  size?: number
}

const RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]

// Claude Code 버튼 아이콘. 로고를 그대로 쓰지 않고 같은 굵기의 광선 8개로 그린 주황색 햇살
export function ClaudeCodeIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true">
      {RAY_ANGLES.map((angle) => (
        <rect
          key={angle}
          x="7"
          y="1"
          width="2"
          height="6"
          rx="1"
          fill="#d97757"
          transform={`rotate(${angle} 8 8)`}
        />
      ))}
    </svg>
  )
}
