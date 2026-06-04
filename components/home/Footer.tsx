import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <Link href="/" className="text-base font-bold tracking-tight text-foreground">
              Hirafi
            </Link>
            <p className="mt-1 text-xs text-muted-foreground">
              Morocco&apos;s local services marketplace
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <Link href="#how-it-works" className="hover:text-foreground transition-colors">
              How it works
            </Link>
            <Link href="#categories" className="hover:text-foreground transition-colors">
              Services
            </Link>
            <Link href="#for-pros" className="hover:text-foreground transition-colors">
              For professionals
            </Link>
            <Link href="/login" className="hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link href="/signup" className="hover:text-foreground transition-colors">
              Sign up
            </Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Hirafi. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
