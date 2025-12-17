import { useEffect } from 'react'
import type { RefObject } from 'react'

export const useClickOutside = (
    ref: RefObject<HTMLElement | null>, // Adjusted type slightly for broader compatibility
    handler: () => void
) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                handler()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [ref, handler])
}
