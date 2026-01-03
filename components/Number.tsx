import { type FC, type ReactNode } from 'react'

interface NumberProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: ReactNode
}

const Number: FC<NumberProps> = ({ children, className = '', ...props }) => {
    return (
        <p
            className={`font-mono md:text-lg text-accent ${className}`}
            {...props}
        >
            {children}
        </p>
    )
}

export default Number
