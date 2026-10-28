
const ListViewSkeleton = () => {
    

    return(
         <div className="w-full bg-white rounded-md shadow-xs border border-slate-200 overflow-hidden mb-10">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#E0E8FF4D] border-b border-slate-200 label-sm">
              <tr className="text-slate-600">
                <th className="py-4 px-6 font-semibold whitespace-nowrap">TASK</th>
                <th className="py-4 px-6 font-semibold">TITLE</th>
                <th className="py-4 px-6 font-semibold whitespace-nowrap">DUE DATE</th>
                <th className="py-4 px-6 font-semibold whitespace-nowrap">STATUS</th>
                <th className="py-4 px-6 font-semibold whitespace-nowrap">ASSIGNEE</th>
                <th className="py-4 px-6 text-right font-semibold whitespace-nowrap">SETTINGS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-6">
                    <div className="h-4 w-16 bg-slate-200 rounded-sm" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-4 w-48 bg-slate-200 rounded-sm" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-4 w-24 bg-slate-200 rounded-sm" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-6 w-20 bg-slate-200 rounded-full" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 bg-slate-200 rounded-lg" />
                      <div className="h-4 w-24 bg-slate-200 rounded-sm" />
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="h-5 w-5 bg-slate-200 rounded-sm ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
}
export default ListViewSkeleton;