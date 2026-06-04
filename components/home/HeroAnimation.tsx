import { Wrench, Zap, CheckCircle2, Star, MapPin, Clock } from 'lucide-react'

export function HeroAnimation() {
  return (
    <div className="relative h-[480px] w-full select-none" aria-hidden>
      {/* Ambient glow blobs */}
      <div
        className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-3xl"
        style={{ animation: 'heroPulse 6s ease-in-out infinite' }}
      />
      <div
        className="absolute right-[10%] top-[15%] h-40 w-40 rounded-full bg-blue-400/15 blur-2xl"
        style={{ animation: 'heroPulse 8s ease-in-out 2s infinite' }}
      />
      <div
        className="absolute bottom-[15%] left-[10%] h-32 w-32 rounded-full bg-orange-300/20 blur-2xl"
        style={{ animation: 'heroPulse 7s ease-in-out 1s infinite' }}
      />

      {/* ── Main booking card (center) ── */}
      <div className="absolute left-1/2 top-[30%] -translate-x-1/2">
        <div
          className="w-56 rounded-2xl border border-border bg-card p-4 shadow-2xl"
          style={{ animation: 'heroFloat 5s ease-in-out infinite' }}
        >
          {/* Header */}
          <div className="mb-3 flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Wrench className="size-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Plumbing Repair</p>
              <p className="text-[10px] text-muted-foreground">Hassan M. · ⭐ 4.9</p>
            </div>
          </div>

          {/* Date row */}
          <div className="flex items-center gap-1.5 rounded-lg bg-muted/60 px-2.5 py-2">
            <Clock className="size-3 shrink-0 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">Fri, Jun 6 · 10:00 AM</span>
          </div>

          {/* Status */}
          <div className="mt-2.5 flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-green-500" />
            <span className="text-[11px] font-semibold text-green-600">Confirmed</span>
          </div>
        </div>
      </div>

      {/* ── Review card (top-left) ── */}
      <div className="absolute left-[4%] top-[14%]">
        <div
          className="w-44 rounded-xl border border-border bg-card p-3 shadow-lg"
          style={{ animation: 'heroFloatReverse 4s ease-in-out 0.8s infinite' }}
        >
          <div className="mb-1.5 flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-yellow-500">
              <Star className="size-3.5" />
            </div>
            <p className="text-[10px] font-semibold text-foreground">New review</p>
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-2.5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="mt-1 text-[9px] leading-snug text-muted-foreground">
            &ldquo;Excellent work, very fast!&rdquo;
          </p>
        </div>
      </div>

      {/* ── Availability card (top-right) ── */}
      <div className="absolute right-[3%] top-[18%]">
        <div
          className="w-40 rounded-xl border border-border bg-card p-3 shadow-lg"
          style={{ animation: 'heroFloat 3.5s ease-in-out 0.4s infinite' }}
        >
          <div className="mb-2 flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-yellow-100 text-yellow-600">
              <Zap className="size-3" />
            </div>
            <span className="text-[10px] font-semibold text-foreground">Electricity</span>
          </div>
          <p className="text-[9px] text-muted-foreground">Karim B. · Available now</p>
          {/* Progress bar (booking demand indicator) */}
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-1 rounded-full bg-primary"
              style={{ width: '70%' }}
            />
          </div>
          <p className="mt-1 text-[8px] text-muted-foreground">7/10 slots taken today</p>
        </div>
      </div>

      {/* ── Location card (bottom-left) ── */}
      <div className="absolute bottom-[16%] left-[2%]">
        <div
          className="w-48 rounded-xl border border-border bg-card p-3 shadow-lg"
          style={{ animation: 'heroFloatReverse 6s ease-in-out 1.5s infinite' }}
        >
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <MapPin className="size-3.5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-foreground">Casablanca · Maarif</p>
              <p className="text-[9px] text-muted-foreground">4 pros available nearby</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Dotted grid overlay (depth) ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--color-foreground) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  )
}
