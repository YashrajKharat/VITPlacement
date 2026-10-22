import "./globals.css";

export const metadata = {
  title: "Centralized Student Placement & Career Resource Portal",
  description: "An enterprise-grade unified student placement drive management portal featuring AI resume reviews, ATS matching, mock interview feedback, and recruiter coordination.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
