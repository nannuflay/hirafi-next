import { getDictionary, type Locale } from '../../../dictionaries'
import { User } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default async function VendorProfilePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const t = (await getDictionary(lang as Locale)).dashboard

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t.profile.title}</h1>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-muted">
            <User className="size-6 text-muted-foreground" />
          </div>
          <p className="mt-4 text-sm font-medium">Profile editing coming soon.</p>
        </CardContent>
      </Card>
    </div>
  )
}
