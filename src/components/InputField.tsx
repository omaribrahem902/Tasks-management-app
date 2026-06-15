import type {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

type InputFieldProps<T extends FieldValues> = {
  label: string;
  id: Path<T>;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  hint?: string;
};

const InputField = <T extends FieldValues>({
  label,
  id,
  type = "text",
  placeholder,
  register,
  errors,
  hint,
}: InputFieldProps<T>) => {
  return (
    <div>
      <label className="label-sm" htmlFor={id}>
        {label}
      </label>

      <input
        {...register(id)}
        className="input-field-custom"
        id={id}
        type={type}
        placeholder={placeholder}
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
