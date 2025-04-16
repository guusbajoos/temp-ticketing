import React, { useState, useEffect } from 'react'

import './style.scss'

const ReadMore = ({ text = '' }) => {
    const [isReadMoreVisible, setIsReadMoreVisible] = useState(false)
    const [isReadMore, setIsReadMore] = useState(false)
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore)
    }

    useEffect(() => {
        if (text && text.length > 75) {
            setIsReadMoreVisible(true)
            setIsReadMore(true)
        }

        return () => {
            setIsReadMore(false)
        }
    }, [text])

    return (
        <>
            <span className={`${isReadMore ? 'note--hide ' : ''}note`}>{text}</span>

            {isReadMoreVisible && (
                <span onClick={toggleReadMore} className="read-or-hide">
                    {isReadMore ? ' read more' : ' show less'}
                </span>
            )}
        </>
    )
}

export default ReadMore
