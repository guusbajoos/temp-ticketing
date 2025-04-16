import { useEffect, useRef } from 'react'

export const usePrevious = (value) => {
    const ref = useRef()
    useEffect(() => {
        ref.current = value
    })
    return ref.current
}

export const useOuterClickNotifier = (onOuterClick, innerRef) => {
    const handleClickOutside = (e) => {
        innerRef.current && !innerRef.current.contains(e.target) && onOuterClick()
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, false)

        return () => {
            document.removeEventListener('click', handleClickOutside, false)
        }
    })
}
