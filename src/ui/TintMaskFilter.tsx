type TintMaskFilterProps = {
  hexColor: string
  id?: string
}

const normalizeHex = (value: string) => {
  const trimmed = value.trim()
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
    return trimmed
  }

  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    return (
      '#' +
      trimmed
        .slice(1)
        .split('')
        .map((char) => char + char)
        .join('')
    )
  }

  if (/^#[0-9a-fA-F]{8}$/.test(trimmed)) {
    return `#${trimmed.slice(1, 7)}`
  }

  return '#9c7a2b'
}

const hexToRgb = (hex: string) => {
  const normalized = normalizeHex(hex).slice(1)
  const int = Number.parseInt(normalized, 16)
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  }
}

const channelToUnit = (value: number) => (value / 255).toFixed(3)

function TintMaskFilter({ hexColor, id = 'tint-mask' }: TintMaskFilterProps) {
  const { r, g, b } = hexToRgb(hexColor)
  const rUnit = channelToUnit(r)
  const gUnit = channelToUnit(g)
  const bUnit = channelToUnit(b)

  return (
    <svg className="story-carousel__filters" aria-hidden="true">
      <defs>
        <filter id={id} colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="
              0.2126 0.7152 0.0722 0 0
              0.2126 0.7152 0.0722 0 0
              0.2126 0.7152 0.0722 0 0
              0 0 0 1 0
            "
            result="gray"
          />
          <feComponentTransfer in="gray" result="tint">
            <feFuncR type="table" tableValues={`${rUnit} 1`} />
            <feFuncG type="table" tableValues={`${gUnit} 1`} />
            <feFuncB type="table" tableValues={`${bUnit} 1`} />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  )
}

export default TintMaskFilter
