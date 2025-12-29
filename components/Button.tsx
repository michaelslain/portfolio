import { FC } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: FC<ButtonProps> = ({ children, className = '', ...props }) => {
    return (
        <button
            className={`px-6 py-3 bg-foreground text-background font-body hover:opacity-90 transition-opacity cursor-pointer text-sm font-bold ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button
