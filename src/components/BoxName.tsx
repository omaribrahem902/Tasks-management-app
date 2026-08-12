interface BoxNameProps {
  name?: string;
}
const BoxName = ({ name = "" }: BoxNameProps) => {
  if (!name) {
    return (
      <button className="primary-container rounded-lg w-12 h-12 center-flex text-white font-semibold">
      </button>
    );
  }
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return (
    <button className="primary-container rounded-lg w-12 h-12 center-flex text-white font-semibold">
      {initials}
    </button>
  );
};

export default BoxName;
