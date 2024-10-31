/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		NEXTAUTH_URL: process.env.NEXTAUTH_URL
	},
	optimizeFonts: true,
	swcMinify: true
}

module.exports = nextConfig
