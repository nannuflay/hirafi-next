import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '../../dictionaries'
import { SignupFlow } from '@/components/auth/SignupFlow'

export default async function SignupPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)

  return <SignupFlow lang={lang} dict={dict} />
}
