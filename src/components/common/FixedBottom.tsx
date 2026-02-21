export default function FixedBottom({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed bottom-0 pb-[16px] px-[16px] w-full max-w-[480px] min-w-[375px]">
      {children}
    </div>
  );
}
