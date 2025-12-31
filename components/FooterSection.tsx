'use client'

import { type FC, useState } from 'react'
import Heading from '@/components/Heading'
import Link from '@/components/Link'
import Section from '@/components/Section'

const FooterSection: FC = () => {
    const [emailCopied, setEmailCopied] = useState(false)

    const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        navigator.clipboard.writeText('misha.slain@gmail.com')
        setEmailCopied(true)
        setTimeout(() => setEmailCopied(false), 2000)
    }

    return (
        <Section
            fullHeight={false}
            className="flex flex-col items-center gap-6 py-16 z-10"
        >
            <Heading level="h2">learn more & reach out!</Heading>
            <div className="flex gap-8 flex-wrap justify-center">
                <Link
                    href="/Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Resume
                </Link>
                <Link
                    href="https://www.linkedin.com/in/michaelslain/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    LinkedIn
                </Link>
                <Link href="#" onClick={handleEmailClick}>
                    {emailCopied ? 'Copied!' : 'Email'}
                </Link>
                <Link
                    href="https://github.com/michaelslain"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub
                </Link>
            </div>
        </Section>
    )
}

export default FooterSection
