import { type FC, type ReactNode } from 'react'

interface NumberProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: ReactNode
}

const Number: FC<NumberProps> = ({ children, className = '', ...props }) => {
    return (
        <p
            className={`font-mono md:text-s text-accent ${className}`}
            style={{ textShadow: '0 0 10px rgba(0, 0, 0, 0.8)' }}
            {...props}
        >
            {children}
        </p>
    )
}

export default Number
