'use client'

import { useEffect, useRef, FC, ReactNode, useState } from 'react'
import { usePathname } from 'next/navigation'

interface SmoothScrollProps {
    children: ReactNode
}

const SmoothScroll: FC<SmoothScrollProps> = ({ children }) => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const pathname = usePathname()
    const scrollInstance = useRef<any>(null)
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        let scroll: any

        const initScroll = async () => {
            if (!scrollRef.current) return

            const LocomotiveScroll = (await import('locomotive-scroll')).default

            scroll = new LocomotiveScroll({
                el: scrollRef.current,
                smooth: true,
            })

            scrollInstance.current = scroll

            // Restore scroll position from localStorage
            const savedScrollPosition = localStorage.getItem('scrollPosition')
            if (savedScrollPosition) {
                const scrollPos = parseFloat(savedScrollPosition)
                // Immediately scroll to position
                scroll.scrollTo(scrollPos, {
                    duration: 0,
                    disableLerp: true,
                })
                // Show content after a brief delay
                setTimeout(() => {
                    setIsReady(true)
                }, 100)
            } else {
                // No saved position, show immediately
                setIsReady(true)
            }

            // Save scroll position on scroll
            scroll.on('scroll', (args: any) => {
                localStorage.setItem('scrollPosition', args.scroll.y.toString())
            })

            // Force update on initialization
            setTimeout(() => {
                scroll.update()
            }, 100)
        }

        initScroll()

        return () => {
            if (scroll) scroll.destroy()
        }
    }, [pathname]) // Recreate scroll instance when route changes

    return (
        <div
            ref={scrollRef}
            data-scroll-container
            style={{
                overflow: 'visible',
                opacity: isReady ? 1 : 0,
                transition: 'opacity 0.1s',
            }}
        >
            {children}
        </div>
    )
}

export default SmoothScroll
