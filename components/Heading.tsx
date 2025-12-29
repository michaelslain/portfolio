import { FC, ReactNode } from 'react'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
    level: HeadingLevel
}

const sizeMap: Record<HeadingLevel, string> = {
    h1: 'text-5xl md:text-6xl lg:text-9xl',
    h2: 'text-4xl md:text-5xl lg:text-6xl',
    h3: 'text-3xl md:text-4xl lg:text-5xl',
    h4: 'text-2xl md:text-3xl lg:text-4xl',
    h5: 'text-xl md:text-2xl lg:text-3xl',
    h6: 'text-lg md:text-xl lg:text-2xl',
}

const Heading: FC<HeadingProps> = ({
    level,
    children,
    className = '',
    ...props
}) => {
    const Tag = level
    const sizeClasses = sizeMap[level]

    return (
        <Tag className={`font-heading ${sizeClasses} ${className}`} {...props}>
            {children}
        </Tag>
    )
}

export default Heading
