'use client'

import { FC } from 'react'
import Tab from './Tab'

interface NavProps {}

const Nav: FC<NavProps> = () => {
    return (
        <nav className="fixed top-4 right-4 z-[100] cursor-auto">
            <div className="bg-background/80 backdrop-blur-md rounded-full px-8 py-3">
                <ul className="flex items-center gap-6">
                    <li>
                        <Tab href="/">H</Tab>
                    </li>
                    <li>
                        <Tab href="/manifesto">Manifesto</Tab>
                    </li>
                    <li>
                        <Tab href="/experience">Experience</Tab>
                    </li>
                    <li>
                        <Tab href="/contact">Contact</Tab>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Nav

/* Original animated version - commented out
const Nav: FC<NavProps> = () => {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <nav className="fixed top-4 right-4 z-50">
            <motion.div
                className="bg-background/80 backdrop-blur-md rounded-full px-4 py-3 overflow-hidden flex"
                initial={{ width: '56px' }}
                animate={{ width: isHovered ? '280px' : '56px' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="flex items-center gap-6 w-full">
                    <motion.div
                        className="flex flex-col gap-1.5 flex-shrink-0"
                        animate={{
                            clipPath: isHovered
                                ? 'inset(100% 0 0 0)'
                                : 'inset(0 0 0 0)',
                        }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                        <span className="block w-6 h-0.5 bg-foreground"></span>
                        <span className="block w-6 h-0.5 bg-foreground"></span>
                        <span className="block w-6 h-0.5 bg-foreground"></span>
                    </motion.div>

                    <ul className="flex items-center gap-6">
                        <li>
                            <Tab
                                href="#about"
                                index={0}
                                isNavHovered={isHovered}
                            >
                                About
                            </Tab>
                        </li>
                        <li>
                            <Tab
                                href="#work"
                                index={1}
                                isNavHovered={isHovered}
                            >
                                Work
                            </Tab>
                        </li>
                        <li>
                            <Tab
                                href="#contact"
                                index={2}
                                isNavHovered={isHovered}
                            >
                                Contact
                            </Tab>
                        </li>
                    </ul>
                </div>
            </motion.div>
        </nav>
    )
}
*/
