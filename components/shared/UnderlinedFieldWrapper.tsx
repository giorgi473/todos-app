type UnderlinedFieldWrapperProps = {
  children: React.ReactNode;
  icon?: React.ReactNode;
  error?: boolean;
};

export function UnderlinedFieldWrapper({
  children,
  icon,
  error,
}: UnderlinedFieldWrapperProps) {
  const hasError = !!error;

  return (
    <div className="relative group">
      {children}
      <span className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-neutral-800" />
      <span
        className={[
          'pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left',
          hasError
            ? 'bg-red-500 scale-x-100'
            : 'bg-linear-to-r from-[#ff9D4D] to-[#ff9D4D] scale-x-0 group-focus-within:scale-x-100 group-hover:scale-x-100 transition-transform duration-300 ease-out',
        ].join(' ')}
      />
      {icon && (
        <span
          className={[
            'absolute right-0 top-1/2 -translate-y-1/2 pointer-events-auto',
            hasError
              ? 'text-red-400'
              : 'text-zinc-500 group-hover:text-[#ff9D4D] transition-colors',
          ].join(' ')}
        >
          {icon}
        </span>
      )}
    </div>
  );
}
