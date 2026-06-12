import '@/features/patient/components/completion-star-rating.css';

type CompletionStarRatingProps = {
  value: number | null;
  onChange: (rating: number) => void;
  maxStars?: number;
  ariaLabel: string;
  starLabel: (star: number) => string;
};

export function CompletionStarRating({
  value,
  onChange,
  maxStars = 5,
  ariaLabel,
  starLabel,
}: CompletionStarRatingProps) {
  const stars = Array.from({ length: maxStars }, (_, index) => index + 1);

  return (
    <div className="completion-star-rating" role="radiogroup" aria-label={ariaLabel}>
      {stars.map((star) => {
        const isSelected = value !== null && star <= value;
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={starLabel(star)}
            className={`completion-star-rating__star${
              isSelected ? ' completion-star-rating__star--selected' : ''
            }`}
            onClick={() => onChange(star)}
          >
            <span aria-hidden="true">★</span>
          </button>
        );
      })}
    </div>
  );
}
