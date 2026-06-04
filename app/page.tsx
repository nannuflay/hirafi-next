import { Navbar } from '@/components/home/Navbar'
import { Hero } from '@/components/home/Hero'
import { Categories } from '@/components/home/Categories'
import { HowItWorks } from '@/components/home/HowItWorks'
import { VendorCTA } from '@/components/home/VendorCTA'
import { Footer } from '@/components/home/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Categories />
        <HowItWorks />
        <VendorCTA />
      </main>
      <Footer />
    </>
  )
}
