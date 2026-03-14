import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-md border border-amber-100 hover:shadow-lg transition-shadow duration-200 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
}: CardProps) {
  return (
    <div className={`px-6 py-4 border-b border-amber-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = "" }: CardProps) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}
