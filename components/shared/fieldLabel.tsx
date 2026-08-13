type FieldLabelProps = {
  children: React.ReactNode;
};

export function FieldLabel({
  children,
}: FieldLabelProps) {
  return (
    <label className="text-xs font-medium text-[#40463F]">
      {children}
    </label>
  );
}