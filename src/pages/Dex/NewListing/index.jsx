import { Fragment, useState } from "react"
import { Transition } from "@headlessui/react"
import { CheckCircleIcon } from "@heroicons/react/24/outline"
import { ClipboardDocumentIcon, XMarkIcon } from "@heroicons/react/24/solid"
import { useWebSocket } from "../../../context/useWebSocket"

export const DexNewListing = () => {
  const { dexListings } = useWebSocket()
  const [show, setShow] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState("")

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            New Listing Notification
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">
            DEX new coing listing info will be shown here.
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden ring-1 shadow-sm ring-black/5 dark:ring-gray-700 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-6"
                    >
                      ChainId
                    </th>
                    {/* <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Description
                    </th> */}
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                    >
                      Header
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                    >
                      Icon
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                    >
                      Token Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                    >
                      Token Symbol
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                    >
                      Token Address
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                    >
                      DEX URL
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                    >
                      Website
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                    >
                      Twitter
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                    >
                      Telegram
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  {Array.isArray(dexListings) &&
                    dexListings.length > 0 &&
                    dexListings.map((item) => (
                      <tr key={item.tokenAddress}>
                        <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-100 sm:pl-6">
                          {item.chainId}
                        </td>
                        {/* <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-800">
                          {item.description}
                        </td> */}
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-800 dark:text-gray-200">
                          <img
                            src={item.header}
                            alt="Token Header"
                            className="w-20 h-auto"
                          />
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-800 dark:text-gray-200">
                          <img
                            src={item.icon}
                            alt="Token Header"
                            className="w-10 h-auto"
                          />
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-800 dark:text-gray-200">
                          {item.baseTokenName}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-800 dark:text-gray-200">
                          {item.baseTokenSymbol}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-800 dark:text-gray-200">
                          <div className="flex items-center gap-x-1">
                            {item.tokenAddress}
                            <ClipboardDocumentIcon
                              aria-hidden="true"
                              className="size-4 cursor-pointer"
                              onClick={() => {
                                navigator.clipboard
                                  .writeText(item.tokenAddress)
                                  .then(() => {
                                    setCopiedAddress(item.tokenAddress)
                                    setShow(true)
                                    setTimeout(() => setShow(false), 2000)
                                  })
                                  .catch((err) =>
                                    console.error("Copy failed", err)
                                  )
                              }}
                            />
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-800 dark:text-gray-200">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Dexscreener View
                          </a>
                        </td>
                        {Array.isArray(item.links) &&
                          item.links?.length > 0 && (
                            <Fragment>
                              <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-800 dark:text-gray-200">
                                {item.links?.some(
                                  (link) => link.label === "Website"
                                ) ? (
                                  <a
                                    href={
                                      item.links.find(
                                        (link) => link.label === "Website"
                                      )?.url
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Website
                                  </a>
                                ) : (
                                  "N/A"
                                )}
                              </td>
                              <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-800 dark:text-gray-200">
                                {item.links?.some(
                                  (link) => link.type === "twitter"
                                ) ? (
                                  <a
                                    href={
                                      item.links.find(
                                        (link) => link.type === "twitter"
                                      )?.url
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Twitter
                                  </a>
                                ) : (
                                  "N/A"
                                )}
                              </td>
                              <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-800 dark:text-gray-200">
                                {item.links?.some(
                                  (link) => link.type === "telegram"
                                ) ? (
                                  <a
                                    href={
                                      item.links.find(
                                        (link) => link.type === "telegram"
                                      )?.url
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Telegram
                                  </a>
                                ) : (
                                  "N/A"
                                )}
                              </td>
                            </Fragment>
                          )}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* copied success notification */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition show={show}>
            <div className="pointer-events-auto w-full max-w-md overflow-hidden rounded-lg bg-white ring-1 shadow-lg ring-black/5 transition data-closed:opacity-0 data-enter:transform data-enter:duration-300 data-enter:ease-out data-closed:data-enter:translate-y-2 data-leave:duration-100 data-leave:ease-in data-closed:data-enter:sm:translate-x-2 data-closed:data-enter:sm:translate-y-0">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="shrink-0">
                    <CheckCircleIcon
                      aria-hidden="true"
                      className="size-6 text-green-400"
                    />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">
                      Successfully saved!
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {copiedAddress}
                    </p>
                  </div>
                  <div className="ml-4 flex shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setShow(false)
                      }}
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
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
    </div>
  )
}
