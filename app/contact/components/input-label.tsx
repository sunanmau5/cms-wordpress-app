type IInputLabelProps = {
  label: string;
  fieldName: string;
  isRequired?: boolean;
};

export default function InputLabel(props: IInputLabelProps) {
  const { label, fieldName, isRequired } = props;
  return (
    <label className="text-base font-semibold" htmlFor={fieldName}>
      {label}
      &nbsp;
      {isRequired ? <span className="text-red-600">*</span> : null}
    </label>
  );
}
