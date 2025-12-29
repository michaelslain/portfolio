import { FC } from 'react'
import Heading from '@/components/Heading'
import BackgroundGrid from '@/components/BackgroundGrid'
import Bitmap3D from '@/components/Bitmap3D'
import GlitchyHeading from '@/components/GlitchyHeading'
import Nav from '@/components/Nav'
import CursorEffect from '@/components/CursorEffect'
import AboutSection from '@/components/AboutSection'
import Skills from '@/components/Skills'
import Footer from '@/components/Footer'

const Home: FC = () => {
    return (
        <>
            <div className="w-screen h-screen flex items-center justify-center flex-col relative cursor-help">
                <Bitmap3D />
                <CursorEffect />
                {/*<BackgroundGrid style="-|" />*/}

                <Heading level="h1">
                    bringing back, <br />
                    what has been forgotten.
                </Heading>

                <Nav />
            </div>

            <AboutSection />

            <div className="w-screen flex flex-col items-center justify-start gap-10 relative pt-32 pb-64">
                <BackgroundGrid style="-|" oddColumns={true} />
                <Heading level="h2" className="relative z-10">
                    skills
                </Heading>
                <div className="relative z-10 w-full">
                    <Skills alignWithGrid={true} gridSpacing={100} />
                </div>
            </div>

            <Footer />
        </>
    )
}

export default Home
