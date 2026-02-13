export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh max-w-[480px] mx-auto flex flex-col">
      {children}
    </div>
  );
}
