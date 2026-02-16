import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "@/lib/tailwindUtils";

function Switch({
  className,
  // size props는 고정된 커스텀 사이즈를 사용하므로 제거
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // 기본 및 포커스 스타일
        "peer inline-flex shrink-0 items-center rounded-full border-[1.5px] border-transparent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        // 고정 사이즈 설정 (전체 너비 39px, 높이 24px)
        "h-[24px] w-[39px]",
        // 커스텀 컬러 설정 (ON: 분홍색 #F571A2, OFF: 회색 #BDBDBD)
        "data-[state=checked]:bg-[#F571A2] data-[state=unchecked]:bg-[#BDBDBD]",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // 기본 썸(원) 스타일 (흰색, 그림자 추가)
          "pointer-events-none block rounded-full bg-white ring-0 transition-transform shadow-sm",
          // 고정 썸 사이즈 설정 (너비 21px, 높이 21px)
          "h-[21px] w-[21px]",
          // 이동 거리 계산: 전체 너비(39) - 테두리*2(3) - 썸 너비(21) = 15px 이동
          "data-[state=checked]:translate-x-[15px] data-[state=unchecked]:translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
