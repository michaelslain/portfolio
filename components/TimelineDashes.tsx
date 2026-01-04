'use client'

import type { FC } from 'react'
import { useState, useEffect } from 'react'

interface TimelineDashesProps {
    experienceCount: number
}

const TimelineDashes: FC<TimelineDashesProps> = ({ experienceCount }) => {
    const [dashCount, setDashCount] = useState(0)

    useEffect(() => {
        setDashCount(Math.ceil((experienceCount * window.innerWidth) / 25))
    }, [experienceCount])

    return (
        <div
            className="absolute bottom-[35%] pointer-events-none z-10"
            style={{
                left: 'calc(50vw - 224px)',
                width: `calc(${experienceCount * 100}vw - 100vw)`,
            }}
        >
            {/* Arrow at the start */}
            <span className="font-mono text-accent text-xs absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
                &lt;
            </span>
            {/* Continuous dashed line with 25px intervals */}
            {Array.from({ length: dashCount }).map((_, i) => (
                <span
                    key={i}
                    className="font-mono text-accent text-xs absolute"
                    style={{
                        left: `${(i + 1) * 25}px`,
                        top: '0',
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    -
                </span>
            ))}
        </div>
    )
}

export default TimelineDashes
