import Link from 'next/link'
import type { Dictionary } from '@/app/[lang]/dictionaries'

type FooterDict = Dictionary['footer']

export function Footer({ lang, dict }: { lang: string; dict: FooterDict }) {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <Link href={`/${lang}`} className="text-base font-bold tracking-tight text-foreground">
              Hirafi
            </Link>
            <p className="mt-1 text-xs text-muted-foreground">{dict.tagline}</p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <Link href={`/${lang}#how-it-works`} className="hover:text-foreground transition-colors">
              {dict.links.howItWorks}
            </Link>
            <Link href={`/${lang}#categories`} className="hover:text-foreground transition-colors">
              {dict.links.services}
            </Link>
            <Link href={`/${lang}#for-pros`} className="hover:text-foreground transition-colors">
              {dict.links.forPros}
            </Link>
            <Link href={`/${lang}/login`} className="hover:text-foreground transition-colors">
              {dict.links.signIn}
            </Link>
            <Link href={`/${lang}/signup`} className="hover:text-foreground transition-colors">
              {dict.links.signUp}
            </Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          &copy; 2026 Hirafi. {dict.copyright}
        </div>
      </div>
    </footer>
  )
}
