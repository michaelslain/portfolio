'use client'

import type { FC } from 'react'
import { useEffect, useRef } from 'react'
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
    title: string
    period: string
    description: string[]
}

const experiences: Experience[] = [
    {
        id: '1',
        company: 'Freelance Web Developer',
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
        company: 'BSide (music magazine)',
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
        company: 'Beetle in a Box (philosophy journal)',
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
        company: 'Doron Studio (design studio)',
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
        company: 'NextStep (business consulting firm)',
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
    const containerRef = useRef<HTMLDivElement>(null)
    const slidesRef = useRef<HTMLDivElement>(null)
    const totalSlides = experiences.length

    useEffect(() => {
        if (!containerRef.current || !slidesRef.current) return

        const container = containerRef.current
        const slides = slidesRef.current

        // Wait for Locomotive Scroll v5 to initialize
        const initAnimation = setTimeout(() => {
            // V5 doesn't require scrollerProxy - works directly with window scroll
            const tween = gsap.to(slides, {
                xPercent: -100 * totalSlides, // Includes title slide
                ease: 'none',
                scrollTrigger: {
                    trigger: container,
                    pin: true,
                    scrub: 1,
                    start: 'top top',
                    end: () => `+=${slides.scrollWidth - window.innerWidth}`,
                    invalidateOnRefresh: true,
                }
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
        <Section customHeight={`${totalSlides * 50}vh`} className="">
            <div
                ref={containerRef}
                className="relative"
            >
                <div
                    ref={slidesRef}
                    className="flex w-fit h-screen"
                >
                    {/* Title Slide */}
                    <div className="w-screen h-screen flex flex-col items-center justify-center px-8 shrink-0 relative">
                        <Heading level="h1" className="text-6xl md:text-8xl">
                            experience
                        </Heading>
                        <div className="absolute right-12 bottom-12">
                            <Text className="text-accent text-4xl">→</Text>
                        </div>
                    </div>

                    {/* Experience Slides */}
                    {experiences.map((experience, index) => (
                        <div
                            key={experience.id}
                            className="w-screen h-screen flex flex-col items-center justify-center px-8 shrink-0 relative"
                        >
                            <div className="max-w-3xl w-full space-y-8">
                                <div className="text-center space-y-4">
                                    <Number className="text-2xl text-accent">
                                        {experience.period}
                                    </Number>
                                    <Heading
                                        level="h1"
                                        className="text-5xl"
                                    >
                                        {experience.company}
                                    </Heading>
                                    <Text className="text-2xl italic opacity-70">
                                        {experience.title}
                                    </Text>
                                </div>

                                <ul className="space-y-4 mt-12">
                                    {experience.description.map(
                                        (item, i) => (
                                            <li
                                                key={i}
                                                className="flex gap-4 items-start"
                                            >
                                                <Text className="text-accent text-xl">
                                                    •
                                                </Text>
                                                <Text className="text-lg">
                                                    {item}
                                                </Text>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>

                            {/* Arrow to next slide */}
                            {index < experiences.length - 1 && (
                                <div className="absolute right-12 bottom-12">
                                    <Text className="text-accent text-4xl">
                                        →
                                    </Text>
                                </div>
                            )}

                            {/* Slide indicator */}
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                                <Text className="text-sm opacity-50">
                                    {index + 2} / {experiences.length + 1}
                                </Text>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    )
}

export default ExperienceSection
