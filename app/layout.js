import "./globals.css";

export const metadata = {
  title: "Wipe AI",
  description: "Take your personal data off the internet.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
