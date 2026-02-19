'use client';

function Wrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`container w-full ${className}`}>{children}</div>;
}

export default Wrapper;
