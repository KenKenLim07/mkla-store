// Loader.tsx - Reusable loading component with variants
import { cn } from '../../utils/cn'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton'
  className?: string
  text?: string
}

const Spinner = ({ size = 'md', className }: { size: string; className?: string }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-pink-600',
        sizeClasses[size as keyof typeof sizeClasses],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  )
}

const Dots = ({ size = 'md', className }: { size: string; className?: string }) => {
  const sizeClasses = {
    sm: 'h-1 w-1',
    md: 'h-2 w-2',
    lg: 'h-3 w-3',
    xl: 'h-4 w-4'
  }

  const dotClass = cn(
    'bg-pink-600 rounded-full animate-bounce',
    sizeClasses[size as keyof typeof sizeClasses]
  )

  return (
    <div className={cn('flex space-x-1', className)} role="status" aria-label="Loading">
      <div className={dotClass} style={{ animationDelay: '0ms' }} />
      <div className={dotClass} style={{ animationDelay: '150ms' }} />
      <div className={dotClass} style={{ animationDelay: '300ms' }} />
    </div>
  )
}

const Pulse = ({ size = 'md', className }: { size: string; className?: string }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20'
  }

  return (
    <div
      className={cn(
        'bg-pink-600 rounded-full animate-pulse',
        sizeClasses[size as keyof typeof sizeClasses],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  )
}

const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn('animate-pulse', className)} role="status" aria-label="Loading">
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  )
}

export const Loader = ({ size = 'md', variant = 'spinner', className, text }: LoaderProps) => {
  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return <Dots size={size} className={className} />
      case 'pulse':
        return <Pulse size={size} className={className} />
      case 'skeleton':
        return <Skeleton className={className} />
      default:
        return <Spinner size={size} className={className} />
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      {renderLoader()}
      {text && (
        <p className="text-sm text-gray-600 animate-pulse" aria-live="polite">
          {text}
        </p>
      )}
    </div>
  )
}

// Specialized loaders for common use cases
export const PageLoader = ({ text = 'Loading...' }: { text?: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <Loader size="lg" text={text} />
  </div>
)

export const ComponentLoader = ({ text }: { text?: string }) => (
  <div className="flex items-center justify-center py-8">
    <Loader size="md" text={text} />
  </div>
)

export const ButtonLoader = () => (
  <Loader size="sm" variant="spinner" className="text-white" />
)

export const InlineLoader = ({ text }: { text?: string }) => (
  <div className="flex items-center space-x-2">
    <Loader size="sm" />
    {text && <span className="text-sm text-gray-600">{text}</span>}
  </div>
) 