import { useCallback } from 'react'
import type { ScrollBehavior } from '../types/home'

/**
 * Custom hook for smooth scrolling to elements
 * Provides a reusable, performant way to handle scroll behavior
 */
export const useScrollToElement = () => {
  const scrollToElement = useCallback(({ 
    targetId, 
    offset = 0, 
    behavior = 'smooth' 
  }: ScrollBehavior) => {
    const element = document.getElementById(targetId)
    
    if (!element) {
      console.warn(`Element with id "${targetId}" not found`)
      return
    }

    const elementPosition = element.offsetTop - offset
    
    window.scrollTo({
      top: Math.max(0, elementPosition),
      behavior
    })
  }, [])

  return { scrollToElement }
}