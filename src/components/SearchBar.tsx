import { Search } from "lucide-react"

const SearchBar = () => {
  return (
    <div className="w-full md:w-50 lg:w-75 flex items-center rounded-md md:rounded-none surface-highest md:mr-45 lg:mr-52  p-3">
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