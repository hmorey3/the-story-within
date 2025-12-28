type CarouselIndicatorProps = {
  count: number
  index: number
}

function CarouselIndicator({ count, index }: CarouselIndicatorProps) {
  if (count <= 1) {
    return null
  }

  return (
    <div className="story-carousel__indicator" aria-hidden="true">
      {Array.from({ length: count }, (_, position) => (
        <span
          key={position}
          className={
            position === index
              ? 'story-carousel__dot story-carousel__dot--active'
              : 'story-carousel__dot'
          }
        />
      ))}
    </div>
  )
}

export default CarouselIndicator
