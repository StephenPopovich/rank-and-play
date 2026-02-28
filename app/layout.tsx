import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: {
    default: "Rank and Play",
    template: "%s | Rank and Play",
  },
  description: "No-bias game rating and community",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* @ts-expect-error Async Server Component */}
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}