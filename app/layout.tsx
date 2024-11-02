import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/toaster'
import localFont from 'next/font/local'
import './globals.css'

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
})
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
})

export const metadata: Metadata = {
	title: 'Gantt Chart Generator',
	description: 'Generate Gantt charts for your projects',
	authors: [{ name: 'adrianbucks', url: 'https://github.com/adrianbucks' }],
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{children}
				<SpeedInsights />
				<Toaster />
			</body>
		</html>
	)
}
