import type { FormButton } from "./types";

interface FormActionsProps {
  buttons: FormButton[];
  isSubmitting?: boolean;
}

const FormActions = ({
  buttons,
  isSubmitting = false,
}: FormActionsProps) => {
  const getButtonClass = (
    variant: FormButton["variant"],
  ) => {
    const base =
      "cursor-pointer general-btn mb-4 rounded-sm md:mb-0";

    switch (variant) {
      case "primary":
        return `${base} btn`;

      case "secondary":
        return `${base} bg-gray-200 text-gray-800 hover:bg-gray-300`;

      case "danger":
        return `${base} bg-red-600 text-white hover:bg-red-700`;

      case "ghost":
      default:
        return `${base} `;
    }
  };

  return (
    <div className="w-full lg:w-fit mt-8 flex flex-col-reverse lg:flex-row justify-end gap-3">
      {buttons.map((button, index) => (
        <button
          key={button.id ?? `${button.label}-${index}`}
          type={button.type}
          disabled={
            button.disabled ||
            (isSubmitting && button.type === "submit")
          }
          onClick={button.onClick}
          className={`${getButtonClass(button.variant)} ${
            button.className ?? ""
          }`}
        >
          {isSubmitting && button.type === "submit"
            ? "Loading..."
            : button.label}
        </button>
      ))}
    </div>
  );
};

export default FormActions;