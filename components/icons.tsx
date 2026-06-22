import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  type LucideProps,
  Menu,
  X,
} from "lucide-react";

export type IconProps = LucideProps;

const Instagram = (props: IconProps) => (
  <svg
    fill="none"
    height="24"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect height="20" rx="5" ry="5" width="20" x="2" y="2" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const Icons = {
  chevronDown: ChevronDown,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  instagram: Instagram,
  loader2: Loader2,
  menu: Menu,
  x: X,
};
