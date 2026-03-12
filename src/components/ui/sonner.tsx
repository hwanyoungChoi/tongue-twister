import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "bg-[#000000CC] rounded-[8px] px-[20px] py-[9.5px] mb-[110px]",
          title: "text-[16px] text-white text-center",
        },
        duration: 1000,
      }}
      position="bottom-center"
      visibleToasts={1}
      {...props}
    />
  );
};

export { Toaster };
