import './globals.css'

export const metadata = {
  title: 'SwiftEssayPro - AI University Essay Generator',
  description: 'Generate professional university admission essays in minutes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
