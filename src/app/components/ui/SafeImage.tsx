'use client'

import { useState } from 'react'

/**
 * @typedef {Object} SafeImageProps
 * @property {string} src
 * @property {string} alt
 * @property {string} [fallbackSrc]
 * @property {string} [className]
 */

export default function SafeImage({ 
    src = '', 
    alt = '', 
    fallbackSrc = '/images/placeholder.svg',
    className = '',
    ...props 
}) {
    const [imgSrc, setImgSrc] = useState<string>(src)
    const [hasError, setHasError] = useState<Boolean>(false)

    const handleError = () => {
        if (!hasError) {
            setHasError(true)
            setImgSrc(fallbackSrc)
        }
    }

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={handleError}
            {...props}
        />
    )
}
