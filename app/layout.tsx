import "./globals.css";

export const metadata = {
  title: "Next JS: Crud in Mongo DB",
  description: "MongoDB Connect in Next Js App Routing",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
