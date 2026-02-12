export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh w-full flex flex-col">{children}</div>;
}
