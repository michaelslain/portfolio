'use client'

import type { FC } from 'react'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Section from '@/components/Section'
import Heading from '@/components/Heading'
import Text from '@/components/Text'
import Number from '@/components/Number'

gsap.registerPlugin(ScrollTrigger)

interface Experience {
    id: string
    company: string
    companyType?: string
    title: string
    period: string
    description: string[]
}

const experiences: Experience[] = [
    {
        id: '1',
        company: 'Freelance',
        title: 'Web Developer',
        period: '2019-2026',
        description: [
            'Built and deployed 10+ responsive web applications using Next.js, React, and TypeScript',
            'Implemented advanced animations and 3D graphics with Three.js, GSAP, and Framer Motion',
            'Optimized web performance, achieving 95+ Lighthouse scores across all projects',
            'Collaborated with clients to deliver custom solutions tailored to their business needs',
        ],
    },
    {
        id: '2',
        company: 'BSide',
        companyType: 'music magazine',
        title: 'Designer, Web Developer',
        period: '2025-2026',
        description: [
            'Designed and developed a modern, user-friendly website for a music publication',
            'Created responsive layouts and interactive components to enhance reader engagement',
            'Collaborated with editorial team to integrate content management systems',
        ],
    },
    {
        id: '3',
        company: 'Beetle in a Box',
        companyType: 'philosophy journal',
        title: 'Designer, Lead Web Developer, Writer',
        period: '2025-2026',
        description: [
            'Led the design and development of a digital philosophy journal platform',
            'Authored and edited philosophical articles for publication',
            'Implemented accessible design principles to ensure content reaches diverse audiences',
            'Managed cross-functional collaboration between writers, editors, and designers',
        ],
    },
    {
        id: '4',
        company: 'Doron Studio',
        companyType: 'design studio',
        title: 'Intern',
        period: '2023-2024',
        description: [
            'Assisted in the design and development of client websites and digital assets',
            'Gained hands-on experience with professional design tools and workflows',
            'Collaborated with senior designers on branding and visual identity projects',
        ],
    },
    {
        id: '5',
        company: 'NextStep',
        companyType: 'business consulting firm',
        title: 'Intern',
        period: '2023',
        description: [
            'Supported business analysis and strategic planning initiatives',
            'Conducted market research to inform client recommendations',
            'Assisted in the preparation of presentations and reports for stakeholders',
        ],
    },
]

const ExperienceSection: FC = () => {
    const wrapperRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const slidesRef = useRef<HTMLDivElement>(null)
    const totalSlides = experiences.length
    const [scrollNumber, setScrollNumber] = useState(100)

    useEffect(() => {
        if (!wrapperRef.current || !containerRef.current || !slidesRef.current)
            return

        const wrapper = wrapperRef.current
        const container = containerRef.current
        const slides = slidesRef.current

        // Wait for Locomotive Scroll v5 to initialize
        const initAnimation = setTimeout(() => {
            // V5 doesn't require scrollerProxy - works directly with window scroll
            const tween = gsap.to(slides, {
                x: () => -(slides.scrollWidth - window.innerWidth), // Move exactly to show last slide
                ease: 'none',
                scrollTrigger: {
                    trigger: wrapper,
                    pin: container,
                    scrub: 1,
                    start: 'top top',
                    end: 'bottom bottom-=50', // End slightly before bottom to ensure animation completes
                    invalidateOnRefresh: true,
                    onUpdate: self => {
                        // Update scroll number from 100 to 0 (counting backwards)
                        const progress = (1 - self.progress) * 100
                        setScrollNumber(Math.floor(progress))
                    },

                    // Lenient snap scrolling - snap to each slide position
                    snap: {
                        snapTo: Array.from(
                            { length: totalSlides + 1 },
                            (_, i) => i / totalSlides
                        ),
                        duration: { min: 0.3, max: 0.8 },
                        delay: 0.2,
                        ease: 'power1.inOut',
                    },
                },
            })

            return () => {
                if (tween.scrollTrigger) tween.scrollTrigger.kill()
                tween.kill()
            }
        }, 1500)

        return () => {
            clearTimeout(initAnimation)
        }
    }, [totalSlides])

    return (
        <div ref={wrapperRef} style={{ height: `${totalSlides * 100}vh` }}>
            <div
                ref={containerRef}
                className="relative h-screen overflow-hidden"
            >
                {/* Large background number */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-20">
                    <Number className="text-[40vw] leading-none font-light">
                        {String(scrollNumber).padStart(3, '0')}
                    </Number>
                </div>

                <div
                    ref={slidesRef}
                    className="flex w-fit h-screen relative z-10"
                >
                    {/* Timeline Arrow - inside the sliding container, aligned with date position */}
                    <div
                        className="absolute bottom-[35%] pointer-events-none z-10"
                        style={{
                            left: 'calc(50vw - 224px)',
                            width: `calc(${
                                experiences.length * 100
                            }vw - 100vw)`,
                        }}
                    >
                        {/* Arrow and continuous dashed line with 25px intervals */}
                        <span className="font-mono text-accent text-xs absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
                            &lt;
                        </span>
                        {Array.from({
                            length: Math.ceil(
                                (experiences.length * window.innerWidth) / 25
                            ),
                        }).map((_, i) => (
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

                    {/* Title Slide */}
                    <div className="w-screen h-screen flex flex-col items-center justify-center px-8 shrink-0 relative">
                        <Heading level="h1" className="text-6xl md:text-8xl">
                            experience
                        </Heading>
                    </div>

                    {/* Experience Slides */}
                    {experiences.map(experience => (
                        <div
                            key={experience.id}
                            className="w-screen h-screen flex flex-col items-center justify-center px-8 shrink-0 relative"
                        >
                            <div className="max-w-md w-full relative">
                                {/* Content above timeline */}
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <Heading level="h2">
                                            {experience.title}
                                        </Heading>
                                        <div className="flex flex-col gap-1">
                                            <Number>
                                                {experience.company}
                                            </Number>
                                            {experience.companyType && (
                                                <Number className=" opacity-50 italic">
                                                    {experience.companyType}
                                                </Number>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <Text className="text-lg leading-relaxed">
                                            {experience.description.join(' ')}
                                        </Text>
                                    </div>
                                </div>
                            </div>

                            {/* Date below timeline */}
                            <div className="absolute bottom-[calc(35%-3rem)] left-1/2 -translate-x-1/2 w-full flex justify-center px-8">
                                <div className="max-w-md w-full">
                                    <Number>{experience.period}</Number>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ExperienceSection
