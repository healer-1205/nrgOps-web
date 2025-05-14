import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axios"
import { API_URL } from "../../utils/constants"

export const Plugins = () => {
  const navigate = useNavigate()
  const userId = localStorage.getItem("id")
  const [plugins, setPlugins] = useState([])

  useEffect(() => {
    axiosInstance({
      method: "get",
      url: `${API_URL}/api/plugins/${userId}`,
    })
      .then((res) => {
        setPlugins(res.data.plugins)
      })
      .catch((err) => {
        console.log("Error to get plugins data: ", err)
      })
  }, [userId])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <p className="text-3xl font-semibold">Plugins</p>
        <button
          type="button"
          className="rounded-md bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
          onClick={() => {
            navigate("/plugins/create")
          }}
        >
          New
        </button>
      </div>
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {plugins.map((plugin) => (
          <li
            key={plugin.id}
            className="col-span-1 rounded-lg bg-[var(--bg-primary)] shadow-sm"
          >
            <div className="flex w-full items-center justify-between space-x-6 p-6">
              <div className="flex-1">
                <div className="flex items-center justify-center space-x-3">
                  {plugin.sources.map((source, index) => (
                    <h3 key={index} className="text-lg font-medium">
                      {source.toUpperCase()}
                    </h3>
                  ))}
                </div>
                {Object.entries(plugin.instructions).map(
                  ([key, rule], index) => (
                    <p
                      key={index}
                      className="mt-1 text-sm text-[var(--text-secondary)]"
                    >
                      <strong>{key}: </strong>
                      {rule}
                    </p>
                  )
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
