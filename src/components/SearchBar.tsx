import { Search } from "lucide-react"

 interface SearchBarProps {
  margin_right?: number;
}
const SearchBar = (props: SearchBarProps) => {
  const { margin_right } = props;
  console.log(margin_right)
  return (
    <div className={`w-full md:w-50 lg:w-75 flex items-center rounded-md md:rounded-none surface-highest  ${margin_right? margin_right > 0 ? "lg:mr-52" : "md:mr-4" : "" }  p-3`}>
    <Search size={12} color="#737685" strokeWidth={1.25} />
      <input
        type="text"
        placeholder="Search epics..."
        className=" body-md ml-3 focus:outline-none "
      />
    </div>
  )
}

export default SearchBar