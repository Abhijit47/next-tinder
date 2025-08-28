export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={'h-dvh flex items-center justify-center px-4'}>
      {children}
    </main>
  );
}
