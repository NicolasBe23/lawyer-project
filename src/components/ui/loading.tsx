export interface LoadingProps {
  text?: string;
  size?: "sm" | "md" | "lg";
}

export function Loading({ text = "Loading...", size = "md" }: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} border-2 border-black border-t-transparent rounded-full animate-spin`}
      ></div>
      <span>{text}</span>
    </div>
  );
}
