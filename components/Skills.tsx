'use client'

import { FC, useEffect, useState } from 'react'
import Text from '@/components/Text'

interface SkillsProps {
    alignWithGrid?: boolean
    gridSpacing?: number
}

const Skills: FC<SkillsProps> = ({ alignWithGrid = false, gridSpacing = 100 }) => {
    const [columnPositions, setColumnPositions] = useState<number[]>([])

    useEffect(() => {
        if (!alignWithGrid) return

        const updatePositions = () => {
            // Calculate number of vertical lines (same logic as BackgroundGrid)
            // For odd number of columns (spaces), we need even number of lines
            let estimatedCols = Math.floor(window.innerWidth / gridSpacing)
            // Make sure we have an even number of lines (for odd spaces between)
            if (estimatedCols % 2 !== 0) {
                estimatedCols = estimatedCols + 1
            }
            // Ensure at least 4 lines (3 columns/spaces)
            let cols = Math.max(4, estimatedCols)
            // Double-check it's even (lines)
            if (cols % 2 !== 0) {
                cols = cols + 1
            }
            const actualSpacing = window.innerWidth / (cols - 1)

            // Use 3 columns closer together around the center
            // Since we have even number of lines, the middle is between two lines
            // For 16 lines (indices 0-15), middle is at 7.5, so we use 5, 7.5, 10 or similar
            const middleIndex = cols / 2

            const positions = [
                (middleIndex - 3) * actualSpacing,
                (middleIndex - 1) * actualSpacing,
                (middleIndex + 1) * actualSpacing,
            ]

            console.log('Skills positioned at line indices:', [middleIndex - 3, middleIndex - 1, middleIndex + 1])

            setColumnPositions(positions)
        }

        updatePositions()
        window.addEventListener('resize', updatePositions)
        return () => window.removeEventListener('resize', updatePositions)
    }, [alignWithGrid, gridSpacing])
    const skillsData = {
        web: [
            'Next.js / React',
            'TypeScript',
            'HTML / CSS / SCSS',
            'Tailwind',
            'Three.js',
        ],
        design: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Procreate'],
        mobile: ['React Native / Expo'],
        other: ['Python', 'Rust', 'Java'],
    }

    const sectionNames = {
        web: 'Web',
        design: 'Design',
        mobile: 'Mobile',
        other: 'Other',
    }

    // Group short sections together in columns
    const organizeColumns = () => {
        const sections = Object.entries(skillsData)
        const SHORT_THRESHOLD = 3

        const longSections = sections.filter(
            ([_, skills]) => skills.length > SHORT_THRESHOLD,
        )
        const shortSections = sections.filter(
            ([_, skills]) => skills.length <= SHORT_THRESHOLD,
        )

        const columns = []

        // Add long sections as individual columns
        longSections.forEach(([key, skills]) => {
            columns.push([
                {
                    key,
                    skills,
                    title: sectionNames[key as keyof typeof sectionNames],
                },
            ])
        })

        // Group short sections together
        for (let i = 0; i < shortSections.length; i += 2) {
            const column = [
                {
                    key: shortSections[i][0],
                    skills: shortSections[i][1],
                    title: sectionNames[
                        shortSections[i][0] as keyof typeof sectionNames
                    ],
                },
            ]

            if (shortSections[i + 1]) {
                column.push({
                    key: shortSections[i + 1][0],
                    skills: shortSections[i + 1][1],
                    title: sectionNames[
                        shortSections[i + 1][0] as keyof typeof sectionNames
                    ],
                })
            }

            columns.push(column)
        }

        return columns
    }

    const columns = organizeColumns()

    if (alignWithGrid && columnPositions.length > 0) {
        return (
            <div className="w-screen relative" style={{ height: 'auto' }}>
                {columns.map((column, colIndex) => (
                    <div
                        key={colIndex}
                        className="absolute flex flex-col"
                        style={{
                            left: `${columnPositions[colIndex]}px`,
                        }}
                    >
                        {column.map((section, sectionIndex) => (
                            <div
                                key={section.key}
                                className={`flex flex-col gap-2 ${sectionIndex > 0 ? 'mt-4' : ''}`}
                            >
                                <Text className="italic underline font-semibold">
                                    {section.title}
                                </Text>
                                {section.skills.map((skill, skillIndex) => (
                                    <Text key={skillIndex}>{skill}</Text>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="w-max flex flex-col items-center">
            <div className="flex gap-12 px-8 items-start">
                {columns.map((column, colIndex) => (
                    <div key={colIndex} className="flex flex-col">
                        {column.map((section, sectionIndex) => (
                            <div
                                key={section.key}
                                className={`flex flex-col gap-2 ${sectionIndex > 0 ? 'mt-4' : ''}`}
                            >
                                <Text className="italic underline font-semibold">
                                    {section.title}
                                </Text>
                                {section.skills.map((skill, skillIndex) => (
                                    <Text key={skillIndex}>{skill}</Text>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Skills
