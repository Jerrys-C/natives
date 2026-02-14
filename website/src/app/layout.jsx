import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import './globals.css'

export const metadata = {
  title: {
    default: 'GTA V Natives Reference',
    template: '%s - GTA V Natives'
  },
  description: 'Comprehensive documentation and reference for GTA V native functions'
}

export default async function RootLayout({ children }) {
  const navbar = (
    <Navbar
      logo={
        <span style={{ fontWeight: 700, fontSize: '1.15em' }}>
          🎮 GTA V Natives
        </span>
      }
      projectLink="https://github.com/AK47-JERRYS-C/natives"
    />
  )
  const pageMap = await getPageMap()
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head faviconGlyph="🎮" />
      <body>
        <Layout
          navbar={navbar}
          footer={
            <Footer>
              MIT {new Date().getFullYear()} © GTA V Natives Documentation
            </Footer>
          }
          docsRepositoryBase="https://github.com/AK47-JERRYS-C/natives/tree/master"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          pageMap={pageMap}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
