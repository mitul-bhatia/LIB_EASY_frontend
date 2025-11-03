import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import NavBar from "@/components/NavBar";

export const metadata = {
  title: "LIB_EASY",
  description: "Library Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        <AuthProvider>
          <NavBar />
          <main className="pt-16">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
