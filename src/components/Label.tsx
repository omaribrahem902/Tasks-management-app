interface LabelProps {
  text: string;
}

const Label = ({ text }: LabelProps) => {
  return (
    <div
      className={`${text === "owner" ? "primary-container text-white" : "surface-highest"} w-fit font-bold text-[10px] uppercase py-1 px-3 lg:rounded-2xl`}
    >
      {text}
    </div>
  );
};

export default Label;
