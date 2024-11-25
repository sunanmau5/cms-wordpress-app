import { cn } from "@/lib/utils";

import { Icons } from "@/components/icons";

const config = {
  right: { className: "right-4", Icon: Icons.chevronRight },
  left: { className: "left-4", Icon: Icons.chevronLeft },
};

interface IArrowButtonProps {
  className?: string;
  direction?: "right" | "left";
  onClick: React.HTMLAttributes<HTMLDivElement>["onClick"];
}

function ArrowButton({
  className: cName,
  direction = "right",
  onClick,
}: IArrowButtonProps) {
  const { className, Icon } = config[direction];

  return (
    <div
      className={cn(
        "absolute top-1/2 flex h-12 w-12 -translate-y-1/2 transform items-center justify-center rounded-full bg-white drop-shadow transition-[transform,opacity] hover:scale-105 sm:transform-gpu",
        className,
        cName,
      )}
      onClick={onClick}
    >
      <Icon className="text-5xl text-black" />
    </div>
  );
}
ArrowButton.displayName = "ArrowButton";

export { ArrowButton };
