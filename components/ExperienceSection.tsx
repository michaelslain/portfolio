'use client'

import type { FC } from 'react'
import Section from '@/components/Section'
import Heading from '@/components/Heading'
import Text from '@/components/Text'

interface Experience {
    id: string
    company: string
    title: string
    period: string
}

const experiences: Experience[] = [
    {
        id: '1',
        company: 'Freelance Web Developer',
        title: 'Web Developer',
        period: '2019-Present',
    },
    {
        id: '2',
        company: 'BSide (music magazine)',
        title: 'Designer, Web Developer',
        period: '2025-Present',
    },
    {
        id: '3',
        company: 'Beetle in a Box (philosophy journal)',
        title: 'Designer, Lead Web Developer, Writer',
        period: '2025-Present',
    },
    {
        id: '4',
        company: 'Math Tutor',
        title: 'Tutor',
        period: '2025',
    },
    {
        id: '5',
        company: 'Doron Studio (design studio)',
        title: 'Intern',
        period: '2023-2024',
    },
    {
        id: '6',
        company: 'NextStep (business consulting firm)',
        title: 'Intern',
        period: '2023',
    },
]

const ExperienceSection: FC = () => {
    return (
        <Section
            fullHeight={false}
            className="flex flex-col items-center justify-start gap-20 py-24"
        >
            <Heading level="h1" className="relative z-10 mb-24">
                experience
            </Heading>

            <div className="relative z-10 w-full max-w-5xl px-8">
                {/* Grid layout: [Time] [Timeline] [Content] */}
                <div className="grid grid-cols-[auto_1px_1fr] gap-0 relative">
                    {experiences.map(experience => (
                        <div key={experience.id} className="contents">
                            {/* Column 1: Time (right-aligned) */}
                            <div className="text-right pr-8 pt-1">
                                <Text className="text-accent font-semibold text-sm whitespace-nowrap">
                                    {experience.period}
                                </Text>
                            </div>

                            {/* Column 2: Timeline column - vertical line goes here */}
                            <div className="relative flex items-start justify-center pt-3">
                                {/* Vertical line spans full height */}
                                <div className="absolute top-0 bottom-0 w-0.5 bg-accent left-1/2 -translate-x-1/2" />
                                {/* Horizontal line extends left and right */}
                                <div className="absolute h-0.5 bg-accent w-8 left-1/2 -translate-x-1/2" />
                            </div>

                            {/* Column 3: Content */}
                            <div className="pt-1 pb-56 pl-8">
                                <Heading level="h2" className="mb-1">
                                    {experience.company}
                                </Heading>
                                <Text className="italic text-base">
                                    {experience.title}
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
