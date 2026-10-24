/**
 * src/components/ui/SkeletonBlock.tsx
 *
 * Generic animated loading placeholder.
 * Pass className to control width, height, and border-radius.
 */

interface SkeletonBlockProps {
  className?: string
}

export function SkeletonBlock({ className = '' }: SkeletonBlockProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-border ${className}`}
    />
  )
}
