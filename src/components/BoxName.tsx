interface BoxNameProps {
  name?: string | null | undefined;
  size?: number;
  fontTheme?: string;
}
const BoxName = ({ name , size = 12, fontTheme = "" }: BoxNameProps) => {
  if (!name) {
    return (
      <button className={`primary-container rounded-lg w-${size} h-${size} center-flex text-white font-semibold`}>
      </button>
    );
  }
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return (
    <button className={` primary-container ${fontTheme} rounded-lg w-${size} h-${size} center-flex text-white font-semibold`}>
      {initials}
    </button>
  );
};

export default BoxName;
