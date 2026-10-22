import type { ReactElement } from "react";
import type {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

export type FormFieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "date"
  | "textarea"
  | "select"
  | "checkbox"
  | "custom";

export interface FormOption {
  label: string;
  value: string;
}

export type FormFieldRenderProps<T extends FieldValues> = {
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  name: Path<T>;
  error?: string;
};

export interface FormFieldConfig<T extends FieldValues> {
  name: Path<T>;
  label: string;

  type: FormFieldType;

  placeholder?: string;

  required?: boolean;
  disabled?: boolean;

  options?: FormOption[];

  min?: string | number;
  max?: string | number;

  colSpan?: 1 | 2;

  className?: string;

  render?: (props: FormFieldRenderProps<T>) => ReactElement | null;
}

export interface FormButton {
  id?: string;
  label: string;

  type: "submit" | "button" | "reset";

  variant?: "primary" | "secondary" | "ghost" | "danger";

  disabled?: boolean;

  onClick?: () => void;

  className?: string;
}

export interface FormFieldProps<T extends FieldValues> {
  field: FormFieldConfig<T>;

  register: UseFormRegister<T>;

  control: Control<T>;

  errors: FieldErrors<T>;

  disabled?: boolean;
}