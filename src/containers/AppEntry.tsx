import { useEffect, useState } from "react";

export default function AppEntry({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="min-h-dvh flex items-center justify-center">Splash</div>
    );
  }

  return <>{children}</>;
}
