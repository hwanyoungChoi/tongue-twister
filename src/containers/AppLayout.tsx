import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-dvh max-w-[480px] min-w-[375px] mx-auto flex flex-col">
      <Outlet />
    </div>
  );
}
