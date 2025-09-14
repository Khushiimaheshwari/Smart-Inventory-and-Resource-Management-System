import "./styles/home.module.css";
import Navbar from "./components/navbar";

export const metadata = {
  title: "Assetra",
  description: "Asset management platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
