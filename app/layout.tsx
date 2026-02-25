import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "RankAndPlay",
  description: "No-bias game rating and community",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* @ts-expect-error Async Server Component */}
        <Nav />
        <main className="mx-auto max-w-6xl p-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
