type FieldLabelProps = {
  children: React.ReactNode;
  htmlFor?: string;
};

export function FieldLabel({ children, htmlFor }: FieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className="text-xs font-medium text-[#40463F]">
      {children}
    </label>
  );
}
