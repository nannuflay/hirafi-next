export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-start justify-center bg-muted/40 px-4 py-12 sm:items-center">
      {children}
    </div>
  )
}
