import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDictionary, hasLocale } from '../../dictionaries'
import { LoginForm } from '@/components/auth/LoginForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  const t = dict.auth.login

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm dict={t} />
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        {t.noAccount}&nbsp;
        <Link
          href={`/${lang}/signup`}
          className="text-foreground font-medium underline underline-offset-4"
        >
          {t.signUp}
        </Link>
      </CardFooter>
    </Card>
  )
}
