import '@/styles/globals.css'
import localFont from 'next/font/local'
import type { AppProps } from 'next/app'

const ogg = localFont({
  src: [
    {
      path: '../../public/fonts/Ogg Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Ogg Bold Italic.ttf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../../public/fonts/Ogg Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Ogg Medium Italic.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../public/fonts/Ogg Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Ogg Regular Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/Ogg Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Ogg Light Italic.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../../public/fonts/Ogg Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Ogg Thin Italic.ttf',
      weight: '100',
      style: 'italic',
    }
  ],
  variable: '--font-ogg'
})

const styreneA = localFont({
  src: [
    {
      path: '../../public/fonts/StyreneALC-Black.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../../public/fonts/StyreneALC-BlackItalic.otf',
      weight: '900',
      style: 'italic',
    },
    {
      path: '../../public/fonts/StyreneALC-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/StyreneALC-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../../public/fonts/StyreneALC-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/StyreneALC-MediumItalic.otf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../public/fonts/StyreneALC-Regular.otf',
      weight: '400',
    },
    {
      path: '../../public/fonts/StyreneALC-RegularItalic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/StyreneALC-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/StyreneALC-LightItalic.otf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../../public/fonts/StyreneALC-Thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/StyreneALC-ThinItalic.otf',
      weight: '100',
      style: 'italic',
    }
  ],
  variable: '--font-styrene-a'
})

const styreneB = localFont({
  src: [
    {
      path: '../../public/fonts/StyreneBLC-Black.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../../public/fonts/StyreneBLC-BlackItalic.otf',
      weight: '900',
      style: 'italic',
    },
    {
      path: '../../public/fonts/StyreneBLC-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/StyreneBLC-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../../public/fonts/StyreneBLC-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/StyreneBLC-MediumItalic.otf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../public/fonts/StyreneBLC-Regular.otf',
      weight: '400',
    },
    {
      path: '../../public/fonts/StyreneBLC-RegularItalic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/StyreneBLC-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/StyreneBLC-LightItalic.otf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../../public/fonts/StyreneBLC-Thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/StyreneBLC-ThinItalic.otf',
      weight: '100',
      style: 'italic',
    }
  ],
  variable: '--font-styrene-b'
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${ogg.variable} ${styreneA.variable} ${styreneB.variable}`}>
      <Component {...pageProps} />
    </main>
  )
}
