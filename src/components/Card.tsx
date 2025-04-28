import {cn} from "../lib/utils.ts";

interface CardProps {
    children: React.ReactNode;
    className?: string;
}
const Card = ({children, className} : CardProps) => {
  return (
    <div className={cn("p-2 bg-white shadow-md rounded-lg", className || "")}>
        {children}
    </div>
  )
}

export default Card