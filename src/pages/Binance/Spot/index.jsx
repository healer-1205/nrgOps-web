import { useState } from "react"
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react"
import { RingLoader } from "react-spinners"
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline"
import axiosInstance from "../../../utils/axios"
import { BASE_URL } from "../../../utils/constants"

const override = {
  borderColor: "#4f46e5",
  zIndex: 31,
}

export const BinanceSpot = () => {
  const [symbol, setSymbol] = useState("")
  const [usdtQuantity, setUsdtQuantity] = useState(0)
  const [openSuccessModal, setSuccessModalOpen] = useState(false)
  const [failedModal, setFailedModal] = useState(false)
  const [orderId, setOrderId] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleClick = () => {
    if (symbol === "" || usdtQuantity === 0) {
      alert("Please fill in the fields")
    } else {
      setLoading(true)
      const data = {
        symbol: symbol,
        usdtQuantity: usdtQuantity,
      }
      axiosInstance({
        method: "post",
        url: `${BASE_URL}/api/binance/spot`,
        data: data,
      })
        .then((res) => {
          if (res.data.success) {
            setOrderId(res.data.orderId)
            setSuccessModalOpen(true)
          } else {
            alert("Failed to buy")
          }
        })
        .catch((err) => {
          setError(err.response.data.message)
          setFailedModal(true)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Binance Spot Trading
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-x-4 pt-4">
        <div>
          <label className="block text-sm/6 font-medium text-gray-900 dark:text-gray-200">
            New Coin Symbol
          </label>
          <input
            type="text"
            placeholder="Ex: BTC"
            className="block rounded-md bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-gray-100 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            onChange={(e) => setSymbol(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">
            USDT Quantity
          </label>
          <input
            type="number"
            className="block rounded-md bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-gray-100 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            onChange={(e) => setUsdtQuantity(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="mt-6 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 hover:cursor-pointer"
          onClick={() => {
            handleClick()
          }}
        >
          Buy
        </button>
      </div>
      {/* success notification modal */}
      <Dialog
        open={openSuccessModal}
        onClose={setSuccessModalOpen}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div>
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-800">
                  <CheckIcon
                    aria-hidden="true"
                    className="size-6 text-green-600"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-gray-900 dark:text-gray-100"
                  >
                    Successfully ordered!
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Order ID: {orderId}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={() => setSuccessModalOpen(false)}
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Confirm
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      {/* failed notification modal */}
      <Dialog
        open={failedModal}
        onClose={setFailedModal}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div>
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-800">
                  <XMarkIcon
                    aria-hidden="true"
                    className="size-6 text-red-600"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-gray-900 dark:text-gray-100"
                  >
                    Order is failed!
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{error}</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={() => setFailedModal(false)}
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Confirm
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
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
    </div>
  )
}
