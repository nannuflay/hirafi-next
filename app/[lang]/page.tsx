import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getDictionary, hasLocale } from './dictionaries'
import { Navbar } from '@/components/home/Navbar'
import { Hero } from '@/components/home/Hero'
import { Categories } from '@/components/home/Categories'
import { HowItWorks } from '@/components/home/HowItWorks'
import { VendorCTA } from '@/components/home/VendorCTA'
import { Footer } from '@/components/home/Footer'

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userRole: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    userRole = profile?.role ?? 'client'
  }

  return (
    <>
      <Navbar lang={lang} dict={dict.nav} userRole={userRole} />
      <main className="flex-1">
        <Hero dict={dict.hero} lang={lang} userRole={userRole} />
        <Categories dict={dict.categories} lang={lang} />
        <HowItWorks dict={dict.howItWorks} />
        <VendorCTA dict={dict.vendorCta} lang={lang} />
      </main>
      <Footer lang={lang} dict={dict.footer} />
    </>
  )
}
