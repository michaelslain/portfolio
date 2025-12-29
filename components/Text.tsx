import { FC } from 'react'

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const Text: FC<TextProps> = ({ children, className = '', ...props }) => {
    // Check if children is a string before applying toUpperCase
    const content =
        typeof children === 'string' ? children.toUpperCase() : children

    return (
        <p
            className={`font-body text-sm leading-relaxed ${className}`}
            {...props}
        >
            {content}
        </p>
    )
}

export default Text
