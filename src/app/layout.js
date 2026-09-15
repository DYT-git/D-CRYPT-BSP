import { Anek_Bangla, Noto_Serif_Bengali, Plus_Jakarta_Sans } from "next/font/google";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import GlobalPdfViewer from "@/components/GlobalPdfViewer";
import { LanguageProvider } from "@/context/LanguageContext";
import { DataProvider } from "@/context/DataContext";
import { prisma } from '@/lib/prisma';
import "./globals.css";

export const dynamic = 'force-dynamic';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans-latin",
  display: "swap",
});

const anekBangla = Anek_Bangla({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-bengali",
  display: "swap",
});

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-bengali",
  display: "swap",
});

export const metadata = {
  title: "Bansdroni Sonali Park - Durga Puja 2026",
  description: "Official website for Bansdroni Sonali Park Durga Puja.",
};

export default async function RootLayout({ children }) {
  const settings = await prisma.siteSetting.findMany();
  
  let primaryColor = '#E11D48'; // Vibrant Alta Red
  let secondaryColor = '#F59E0B'; // Bright Amber

  settings.forEach(s => {
    if (s.key === 'primaryColor') primaryColor = s.value;
    if (s.key === 'secondaryColor') secondaryColor = s.value;
  });

  return (
    <html lang="bn">
      <body 
        className={`${plusJakarta.variable} ${anekBangla.variable} ${notoSerifBengali.variable} antialiased`}
        style={{
          '--color-brand-maroon': primaryColor,
          '--color-brand-gold': secondaryColor,
        }}
      >
        <DataProvider>
          <LanguageProvider>
            <ClientLayoutWrapper>
              {children}
            </ClientLayoutWrapper>
          <GlobalPdfViewer />
        </LanguageProvider>
        </DataProvider>
      </body>
    </html>
  );
}
