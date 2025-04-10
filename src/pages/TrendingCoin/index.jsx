import { useEffect, useState, useRef, useMemo } from "react"
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react"
import { CheckIcon } from "@heroicons/react/24/outline"
import assets from "../../assets"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export const TrendingCoin = () => {
  const [prices, setPrices] = useState({})
  const [priceHistory, setPriceHistory] = useState({})
  const wsRef = useRef(null)
  const [showAlertModal, setShowAlertModal] = useState(false)
  const [alertData, setAlertData] = useState(null)
  const reconnectInterval = useRef(null)
  const lastUpdatedTime = useRef({}) // store last updated time for each symbol
  const [lastAlertTime, setLastAlertTime] = useState({}) // store last alert time for each symbol

  useEffect(() => {
    let ws

    const connectWebSocket = () => {
      ws = new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr")
      wsRef.current = ws

      ws.onopen = () => {
        console.log("✅ WebSocket Connected")
        if (reconnectInterval.current) {
          clearInterval(reconnectInterval.current)
          reconnectInterval.current = null
        }
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        const stablecoins = ["USDT", "USDC"]
        const filteredData = data.filter((ticker) =>
          stablecoins.some((stable) => ticker.s.endsWith(stable))
        )

        // update only if the data value is new
        const updatedPrices = {}
        filteredData.forEach((ticker) => {
          const now = Date.now()
          const lastUpdate = lastUpdatedTime.current[ticker.s] || 0

          // prevent too fast update
          if (now - lastUpdate >= 500) {
            updatedPrices[ticker.s] = parseFloat(ticker.c)
            lastUpdatedTime.current[ticker.s] = now // update last update time
          }
        })

        if (Object.keys(updatedPrices).length > 0) {
          setPrices((prevPrices) => ({
            ...prevPrices,
            ...updatedPrices,
          }))
        }
      }

      ws.onclose = () => {
        console.log("❌ WebSocket Disconnected. Reconnecting in 5s...")
        if (!reconnectInterval.current) {
          reconnectInterval.current = setInterval(() => {
            connectWebSocket()
          }, 5000)
        }
      }

      ws.onerror = (error) => {
        console.error("⚠️ WebSocket Error: ", error)
        ws.close()
      }
    }

    connectWebSocket()

    return () => {
      if (ws) ws.close()
      if (reconnectInterval.current) clearInterval(reconnectInterval.current)
    }
  }, [])

  useEffect(() => {
    setPriceHistory((prevHistory) => {
      const updatedHistory = { ...prevHistory }

      Object.keys(prices).forEach((symbol) => {
        if (!updatedHistory[symbol]) {
          updatedHistory[symbol] = []
        }

        // prevent to store same data
        const lastRecordedPrice =
          updatedHistory[symbol][updatedHistory[symbol].length - 1]
        if (lastRecordedPrice !== prices[symbol]) {
          updatedHistory[symbol].push(prices[symbol])

          // store up to 60 records
          if (updatedHistory[symbol].length > 60) {
            updatedHistory[symbol].shift()
          }
        }
      })

      return updatedHistory
    })
  }, [prices])

  const sortedCoins = useMemo(() => {
    return Object.keys(prices)
      .map((symbol) => {
        const currentPrice = prices[symbol]
        const price1MinAgo =
          priceHistory[symbol]?.length >= 60 ? priceHistory[symbol][0] : null

        const minAgoChange =
          price1MinAgo !== null
            ? ((currentPrice - price1MinAgo) / price1MinAgo) * 100
            : null

        return {
          symbol,
          currentPrice,
          price1MinAgo,
          minAgoChange,
        }
      })
      .filter((data) => data.minAgoChange !== null)
      .sort((a, b) => b.minAgoChange - a.minAgoChange) // Sort by largest change per minute
  }, [prices, priceHistory])

  useEffect(() => {
    const alertCoin = sortedCoins.find((coin) => coin.minAgoChange >= 2)

    if (alertCoin) {
      const now = Date.now()
      const lastTime = lastAlertTime[alertCoin.symbol] || 0

      if (now - lastTime >= 24 * 60 * 60 * 1000) {
        // Show notification only once per day (24 hours)
        setAlertData(alertCoin)
        setShowAlertModal(true)
        setLastAlertTime((prev) => ({
          ...prev,
          [alertCoin.symbol]: now,
        }))
      }
    }
  }, [sortedCoins])

  useEffect(() => {
    if (showAlertModal && alertData) {
      const alertSound = new Audio(assets.Alarm)

      // play alarm loop
      const interval = setInterval(() => {
        alertSound.play()
      }, 3000) // play alarm sound every 3 seconds

      return () => {
        clearInterval(interval) // stop alarm sound when modal is opened
      }
    }
  }, [showAlertModal, alertData])

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">
            Coin price change
          </h1>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden ring-1 shadow-sm ring-black/5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Coin
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Symbol
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Price 1 min ago
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Current Price
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Last 1-Min Change (%)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {sortedCoins.map(
                    ({ symbol, currentPrice, price1MinAgo, minAgoChange }) => (
                      <tr key={symbol}>
                        <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">
                          {symbol.replace(/USDT|USDC/, "")}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          {symbol}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          ${price1MinAgo?.toFixed(4)}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          ${currentPrice.toFixed(4)}
                        </td>
                        <td
                          className={classNames(
                            minAgoChange >= 0
                              ? "text-green-500"
                              : "text-red-500",
                            "px-3 py-4 text-sm whitespace-nowrap"
                          )}
                        >
                          {minAgoChange !== null
                            ? `${minAgoChange.toFixed(2)}%`
                            : "Waiting..."}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={showAlertModal}
        onClose={setShowAlertModal}
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
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div>
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100">
                  <CheckIcon
                    aria-hidden="true"
                    className="size-6 text-green-600"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-gray-900"
                  >
                    Price Surge Alert!
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {alertData?.symbol} increased by{" "}
                      {alertData?.minAgoChange.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={() => setShowAlertModal(false)}
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Confirm
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
