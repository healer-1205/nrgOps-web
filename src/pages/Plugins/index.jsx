import { useNavigate } from "react-router-dom"

const plugins = [
  {
    name: "Plugin 1",
    title: "Plugin 1 description",
  },
  {
    name: "Plugin 2",
    title: "Plugin 2 description",
  },
  {
    name: "Plugin 3",
    title: "Plugin 3 description",
  },
  {
    name: "Plugin 4",
    title: "Plugin 4 description",
  },
]

export const Plugins = () => {
  const navigate = useNavigate()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <p className="text-3xl font-semibold mb-8">Plugins</p>
        <button
          type="button"
          className="rounded-md bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
          onClick={() => {
            navigate("/plugins/create")
          }}
        >
          Create
        </button>
      </div>
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {plugins.map((plugin, index) => (
          <li
            key={index}
            className="col-span-1 rounded-lg bg-[var(--bg-primary)] shadow-sm"
          >
            <div className="flex w-full items-center justify-between space-x-6 p-6">
              <div className="flex-1 truncate">
                <div className="flex items-center space-x-3">
                  <h3 className="truncate text-lg font-medium">
                    {plugin.name}
                  </h3>
                </div>
                <p className="mt-1 truncate text-sm text-[var(--text-secondary)]">
                  {plugin.title}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
