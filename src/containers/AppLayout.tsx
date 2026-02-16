export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh max-w-[480px] min-w-[375px] mx-auto flex flex-col">
      {children}
    </div>
  );
}
