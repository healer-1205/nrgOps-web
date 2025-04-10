import { useState, useEffect } from "react"
import { RingLoader } from "react-spinners"
import { Transition } from "@headlessui/react"
import { CheckCircleIcon } from "@heroicons/react/24/outline"
import { ClipboardDocumentIcon, XMarkIcon } from "@heroicons/react/24/solid"
import ReactPaginate from "react-paginate"
import axiosInstance from "../../../utils/axios"
import { BASE_URL } from "../../../utils/constants"

const override = {
  borderColor: "#4f46e5",
  zIndex: 31,
}

export const DexLegitimate = () => {
  const [loading, setLoading] = useState(false)
  const [tokenData, setTokenData] = useState([])
  const [copiedAddress, setCopiedAddress] = useState("")
  const [show, setShow] = useState(false)
  const [pageCount, setPageCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10

  const getVerifiedTokenData = async (page) => {
    setLoading(true)
    axiosInstance({
      method: "get",
      url: `${BASE_URL}/api/dex/getVerifiedTokenData?page=${
        page + 1
      }&limit=${itemsPerPage}`,
    })
      .then((res) => {
        setTokenData(res.data.tokens)
        setPageCount(res.data.pagination.totalPages)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getVerifiedTokenData(currentPage)
  }, [currentPage])

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }

  const removeToken = (tokenAddress) => {
    const data = {
      tokenAddress: tokenAddress,
      currentPage: currentPage,
    }
    setLoading(true)
    axiosInstance({
      method: "post",
      url: `${BASE_URL}/api/dex/removeSelectedToken`,
      data: data,
    })
      .then((res) => {
        setTokenData(res.data.tokens)
        setPageCount(res.data.pagination.totalPages)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Legitimate token list
          </h1>
          <p className="mt-2 text-sm text-red-400">
            You must re-verify your tokens using a trusted third-party platform
            before trading.
            <br />
            You must check <span className="text-md font-bold">
              Gas Fee
            </span>{" "}
            and slippage before trading especially for Ethereum network tokens.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => {
              getVerifiedTokenData(0)
            }}
          >
            Get verified tokens
          </button>
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
                    <th
                      scope="col"
                      className="relative py-3.5 pr-4 pl-3 sm:pr-6"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  {Array.isArray(tokenData) &&
                    tokenData.length > 0 &&
                    tokenData.map((item) => {
                      return item.goPlusSupport ? (
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
                            {item.tokenName}
                          </td>
                          <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-800 dark:text-gray-200">
                            {item.tokenSymbol}
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
                              href={item.dexURL}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Dexscreener View
                            </a>
                          </td>
                          <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-800 dark:text-gray-200">
                            {item.website === "N/A" ? (
                              "N/A"
                            ) : (
                              <a
                                href={item.website}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Website
                              </a>
                            )}
                          </td>
                          <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-800 dark:text-gray-200">
                            {item.twitter === "N/A" ? (
                              "N/A"
                            ) : (
                              <a
                                href={item.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Twitter
                              </a>
                            )}
                          </td>
                          <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-800 dark:text-gray-200">
                            {item.telegram === "N/A" ? (
                              "N/A"
                            ) : (
                              <a
                                href={item.telegram}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Telegram
                              </a>
                            )}
                          </td>
                          <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6">
                            <button
                              className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                              onClick={() => {
                                removeToken(item.tokenAddress)
                              }}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ) : (
                        <tr key={item.tokenAddress} className="text-amber-500">
                          <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap sm:pl-6">
                            {item.chainId}
                          </td>
                          {/* <td className="px-3 py-4 text-sm whitespace-nowrap">
                          {item.description}
                        </td> */}
                          <td className="px-3 py-4 text-sm whitespace-nowrap">
                            <img
                              src={item.header}
                              alt="Token Header"
                              className="w-20 h-auto"
                            />
                          </td>
                          <td className="px-3 py-4 text-sm whitespace-nowrap">
                            <img
                              src={item.icon}
                              alt="Token Header"
                              className="w-10 h-auto"
                            />
                          </td>
                          <td className="px-3 py-4 text-sm whitespace-nowrap">
                            {item.tokenName}
                          </td>
                          <td className="px-3 py-4 text-sm whitespace-nowrap">
                            {item.tokenSymbol}
                          </td>
                          <td className="px-3 py-4 text-sm whitespace-nowrap">
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
                          <td className="px-3 py-4 text-sm whitespace-nowrap">
                            <a
                              href={item.dexURL}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Dexscreener View
                            </a>
                          </td>
                          <td className="px-3 py-4 text-sm whitespace-nowrap">
                            {item.website === "N/A" ? (
                              "N/A"
                            ) : (
                              <a
                                href={item.website}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Website
                              </a>
                            )}
                          </td>
                          <td className="px-3 py-4 text-sm whitespace-nowrap">
                            {item.twitter === "N/A" ? (
                              "N/A"
                            ) : (
                              <a
                                href={item.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Twitter
                              </a>
                            )}
                          </td>
                          <td className="px-3 py-4 text-sm whitespace-nowrap">
                            {item.telegram === "N/A" ? (
                              "N/A"
                            ) : (
                              <a
                                href={item.telegram}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Telegram
                              </a>
                            )}
                          </td>
                          <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6">
                            <button
                              className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                              onClick={() => {
                                removeToken(item.tokenAddress)
                              }}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-center mt-3">
            <ReactPaginate
              nextLabel=">"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              marginPagesDisplayed={3}
              pageCount={pageCount}
              previousLabel="<"
              pageClassName="relative z-10 inline-flex items-center text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 border border-gray-300 cursor-pointer"
              pageLinkClassName="px-4 py-2"
              previousClassName="relative inline-flex items-center rounded-l-md text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer"
              previousLinkClassName="px-2 py-2"
              nextClassName="relative inline-flex items-center rounded-r-md text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer"
              nextLinkClassName="px-2 py-2"
              breakLabel="..."
              breakClassName="relative inline-flex items-center text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer"
              breakLinkClassName="px-4 py-2"
              containerClassName="isolate inline-flex -space-x-px rounded-md shadow-sm"
              activeClassName="bg-sky-600 text-white"
              disabledClassName=""
              renderOnZeroPageCount={null}
            />
          </div>
        </div>
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
