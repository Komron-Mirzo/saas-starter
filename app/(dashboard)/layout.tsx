import { Header } from '@/components/sections/shared/Header';
import { Footer } from '@/components/sections/shared/Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen bg-[#F3F3F3]">
      <Header />
      {children}
      <Footer />
    </section>
  );
}