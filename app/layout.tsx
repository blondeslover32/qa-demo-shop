import type { Metadata } from "next";
import { Header } from "../components/header";
import "./globals.css";
export const metadata: Metadata = {
  title: "EverShop — QA fallback demo",
  description: "A small local shop for the browser QA demo.",
};
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <footer>
          QA fallback demo · Sample products and browser-local orders
        </footer>
      </body>
    </html>
  );
}
