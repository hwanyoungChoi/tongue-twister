import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/tailwindUtils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",

        // ✅ [추가 1] 게임 전용 핑크 (성공/시작)
        primary:
          "bg-gradient-to-b from-[#FF99C0] to-[#ED5890] text-white border-[3px] border-[#28323B] transition-transform active:scale-99 active:brightness-95 font-one-pop",

        // ✅ [추가 2] 게임 전용 회색 (실패/꼬임)
        secondary:
          "bg-gradient-to-b from-[#666666] to-[#4A4A4A] text-white border-[3px] border-[#28323B] transition-transform active:scale-99 active:brightness-90 font-one-pop",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",

        // ✅ [추가 3] 게임 버튼 전용 사이즈 (높이 72px, 둥글기 20px, 폰트 25px, 행간 170%)
        md: "h-[72px] w-full rounded-[20px] text-[28px] font-[400] leading-[170%]",
        sm: "h-[56px] w-full rounded-[16px] text-[22px] font-[400] leading-[170%]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
