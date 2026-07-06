import type { Metadata } from "next";
import { Bebas_Neue, Bangers, Cormorant_Garamond, Luckiest_Guy, Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/Cursor";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import CartDrawer from "@/components/CartDrawer";
import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import AudioPlayer from "@/components/AudioPlayer";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import { ReduxProvider } from "@/store/redux/ReduxProvider";
import { NextAuthProvider } from "./NextAuthProvider";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" });
const bangers = Bangers({ weight: "400", subsets: ["latin"], variable: "--font-bangers" });
const luckiestGuy = Luckiest_Guy({ weight: "400", subsets: ["latin"], variable: "--font-luckiest" });
const cormorant = Cormorant_Garamond({ weight: ["400", "600"], style: ["normal", "italic"], subsets: ["latin"], variable: "--font-cormorant" });

export const metadata: Metadata = {
  title: "One Piece — Gear 5 Cinematic Reveal",
  description: "An interactive cinematic experience celebrating Monkey D. Luffy's Gear 5 awakening.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${bebasNeue.variable} ${bangers.variable} ${luckiestGuy.variable} ${cormorant.variable} antialiased bg-[#04060c] text-white`}
      >
        <NextAuthProvider>
          <ReduxProvider>
            <SmoothScroll>
              <ReactQueryProvider>
                <WishlistProvider>
                  <CartProvider>
                    <ScrollProgressBar />
                    <CustomCursor />
                    <CartDrawer />
                    <Header />
                    {children}
                    <AudioPlayer />
                  </CartProvider>
                </WishlistProvider>
              </ReactQueryProvider>
            </SmoothScroll>
          </ReduxProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
