import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const config = {
  right: { className: "right-4", Icon: MdChevronRight },
  left: { className: "left-4", Icon: MdChevronLeft },
};

interface IArrowButtonProps {
  direction?: "right" | "left";
  onClick: React.HTMLAttributes<HTMLDivElement>["onClick"];
}

function ArrowButton({ direction = "right", onClick }: IArrowButtonProps) {
  const { className, Icon } = config[direction];

  return (
    <div
      className={`${className} absolute top-1/2 flex h-12 w-12 -translate-y-1/2 transform cursor-pointer items-center justify-center rounded-full bg-white drop-shadow transition-all hover:scale-105 sm:transform-gpu`}
      onClick={onClick}
    >
      <Icon className="text-5xl text-black" />
    </div>
  );
}

export default ArrowButton;
