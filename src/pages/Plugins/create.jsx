import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Switch,
  Transition,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react"
import {
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline"
import { RingLoader } from "react-spinners"
import axiosInstance from "../../utils/axios"
import { API_URL } from "../../utils/constants"
import { integrations } from "../../utils/constants"
import { override } from "../../utils/constants"

export const CreatePlugin = () => {
  const navigate = useNavigate()
  const userId = localStorage.getItem("id")
  const [enabledStates, setEnabledStates] = useState(
    Object.fromEntries(integrations.map((item) => [item.id, false]))
  )
  const [showSuccess, setShowSuccess] = useState(false) // notification for saved successfully
  const [showError, setShowError] = useState(false) // notification to alert error
  const [loading, setLoading] = useState(false) // for spinner toggle
  const [message, setMessage] = useState("")
  const [open, setOpen] = useState(false)  // modal to show error message
  const [errorMessage, setErrorMessage] = useState("")

  const toggleSwitch = (id) => {
    setEnabledStates((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleSendMessage = async () => {
    // sources = selected integrations
    const sources = Object.entries(enabledStates)
      .filter(([key, value]) => value === true)
      .map(([key, value]) => key)

    if (sources.length === 0 || !message.trim()) {
      setShowError(true)
      setTimeout(() => {
        setShowError(false)
      }, 2000)
      return
    }

    try {
      setLoading(true)
      const response = await axiosInstance({
        method: "post",
        url: `${API_URL}/api/plugins/create`,
        data: {
          sources: sources,
          prompt: message,
          userId: userId,
        },
      })
      if (response.data.status === "success") {
        setLoading(false)
        setMessage("")
        setEnabledStates(
          Object.fromEntries(integrations.map((item) => [item.id, false]))
        )
        setShowSuccess(true)
        setTimeout(() => {
          setShowSuccess(false)
        }, 2000)
      } else if (response.data.status === "wrong_input") {
        setLoading(false)
        setErrorMessage(response.data.message)
        setOpen(true)
      } else {
        setLoading(false)
        setErrorMessage("Sever error occurred. Please try again.")
        setOpen(true)
      }
    } catch (error) {
      console.error("Error during create a new plugin:", error)
      setLoading(false)
      setShowError(true)
      setTimeout(() => {
        setShowError(false)
      }, 2000)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <p className="text-3xl font-semibold">Plugin Generator</p>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            className="rounded-md bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
            onClick={handleSendMessage}
          >
            Create
          </button>
          <button
            type="button"
            className="rounded-md bg-red-600 hover:bg-red-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 cursor-pointer"
            onClick={() => {
              navigate("/plugins")
            }}
          >
            Back
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 grid-cols-1 md:gap-x-6">
        <textarea
          placeholder="Send a message to create your plugin"
          rows={2}
          className="col-span-2 w-full px-4 py-3 md:mb-0 mb-6 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 border resize-none border-[var(--border-color)]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              if (!message.trim()) return
              handleSendMessage()
            }
          }}
        />
        <ul role="list" className="grid grid-rows-1 gap-6">
          {integrations.map((item) => (
            <li
              key={item.id}
              className="col-span-1 rounded-lg bg-[var(--bg-primary)] shadow-sm"
            >
              <div className="flex w-full items-center justify-between space-x-6 p-4">
                <div className="flex-1 truncate">
                  <div className="flex items-center justify-between m-2">
                    <div className="flex items-center space-x-2">
                      <img alt={item.name} src={item.img} className="size-8" />
                      <h3 className="text-md font-medium">{item.name}</h3>
                    </div>
                    <Switch
                      checked={enabledStates[item.id]}
                      onChange={() => toggleSwitch(item.id)}
                      className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-300 transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:outline-hidden data-checked:bg-indigo-600"
                    >
                      <span className="sr-only">Use setting</span>
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          enabledStates[item.id] ? "translate-x-5" : ""
                        }`}
                      />
                    </Switch>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Spinner */}
      {loading && (
        <div className="z-30 fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity opacity-100 flex items-center justify-center">
          <RingLoader
            color="#4f46e5"
            loading={loading}
            cssOverride={override}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
      {/* End Spinner */}

      {/* <textarea
        placeholder="Send a message to NrgOps"
        rows={2}
        className={`mb-8 w-full px-4 py-3 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 border resize-none border-[var(--border-color)]`}
      />

      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {integrations.map((item) => (
          <li
            key={item.id}
            className="col-span-1 rounded-lg bg-[var(--bg-primary)] shadow-sm"
          >
            <div className="flex w-full items-center justify-between space-x-6 p-4">
              <div className="flex-1 truncate">
                <div className="flex items-center justify-between m-2">
                  <div className="flex items-center space-x-2">
                    <img alt={item.name} src={item.img} className="size-8" />
                    <h3 className="text-md font-medium">{item.name}</h3>
                  </div>
                  <Switch
                    checked={enabledStates[item.id]}
                    onChange={() => toggleSwitch(item.id)}
                    className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:outline-hidden data-checked:bg-indigo-600"
                  >
                    <span className="sr-only">Use setting</span>
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        enabledStates[item.id] ? "translate-x-5" : ""
                      }`}
                    />
                  </Switch>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul> */}

      {/* notification to show data saved successfully */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-10"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition show={showSuccess}>
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-[var(--bg-primary)] shadow-lg ring-1 ring-black/5 transition data-closed:opacity-0 data-enter:transform data-enter:duration-300 data-enter:ease-out data-closed:data-enter:translate-y-2 data-leave:duration-100 data-leave:ease-in data-closed:data-enter:sm:translate-x-2 data-closed:data-enter:sm:translate-y-0">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="shrink-0">
                    <CheckCircleIcon
                      aria-hidden="true"
                      className="size-6 text-green-400"
                    />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      Successfully saved!
                    </p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      You can use the plugin now.
                    </p>
                  </div>
                  <div className="ml-4 flex shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setShowSuccess(false)
                      }}
                      className="inline-flex rounded-md bg-[var(--bg-primary)] text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden cursor-pointer"
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon aria-hidden="true" className="size-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      {/* notification to show error because you didn't select any integration */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-10"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition show={showError}>
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-[var(--bg-primary)] shadow-lg ring-1 ring-black/5 transition data-closed:opacity-0 data-enter:transform data-enter:duration-300 data-enter:ease-out data-closed:data-enter:translate-y-2 data-leave:duration-100 data-leave:ease-in data-closed:data-enter:sm:translate-x-2 data-closed:data-enter:sm:translate-y-0">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="shrink-0">
                    <CheckCircleIcon
                      aria-hidden="true"
                      className="size-6 text-red-400"
                    />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      Cannot create plugins!
                    </p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      You should select at least one integration and input
                      prompts.
                    </p>
                  </div>
                  <div className="ml-4 flex shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setShowError(false)
                      }}
                      className="inline-flex rounded-md bg-[var(--bg-primary)] text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden cursor-pointer"
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon aria-hidden="true" className="size-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      {/* modal to show error message */}
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-[var(--bg-primary)] px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div>
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100">
                  <ExclamationTriangleIcon
                    aria-hidden="true"
                    className="size-6 text-red-600"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold"
                  >
                    Error to create a new plugin
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-[var(--text-secondary)]">{errorMessage}</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
                >
                  OK
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
