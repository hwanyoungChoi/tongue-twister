export default function ShadowBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white p-[16px] rounded-[16px] shadow-[0_0_10px_0_rgba(0,0,0,0.08)]">
      {children}
    </div>
  );
}
