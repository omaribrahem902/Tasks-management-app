import type {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

type InputFieldProps<T extends FieldValues> = {
  label: string;
  optional?: boolean;
  id: Path<T>;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  hint?: string;
  value?: string;
};

const InputField = <T extends FieldValues>({
  label,
  id,
  type = "text",
  placeholder,
  register,
  errors,
  hint,
  optional,
  value,
}: InputFieldProps<T>) => {
  return (
    <div>
      <label className="flex justify-between label-sm mb-1.5 " htmlFor={id}>
        {label}
        {optional && <span className="slate-2"> Optional</span>}
      </label>

      <input
        {...register(id)}
        className={`input-field-custom ${optional ? "h-44" : ""}`} 
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
      />

      {errors[id] ? (
        <p className="label-sm text-[#BA1A1A]">
          {errors[id]?.message as string}
        </p>
      ) : (
        <span className="slate-3 label-sm">{hint}</span>
      )}
    </div>
  );
};

export default InputField;
