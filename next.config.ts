import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    experimental: {
        turbo: {
            resolveAlias: {
                'framer-motion': 'framer-motion',
            },
        },
    },
    transpilePackages: ['framer-motion'],
}

export default nextConfig
