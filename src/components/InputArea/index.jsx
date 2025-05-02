import { memo } from "react"
import { PaperAirplaneIcon } from "@heroicons/react/24/outline"

export const InputArea = memo(
  ({
    isStandalone = false,
    message,
    setMessage,
    handleSendMessage,
    isLoading,
    handleKeyDown,
  }) => {
    return (
      <div
        className={`${
          isStandalone
            ? "w-full max-w-2xl p-4 rounded-lg shadow-md"
            : "sticky bottom-0 w-full border-t border-[var(--border-color)] bg-[var(--bg-primary)] p-4"
        }`}
      >
        <div className={`${isStandalone ? "" : "max-w-3xl mx-auto"}`}>
          <div className="flex items-center gap-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send a message to NABL"
              rows={2}
              className="flex-grow px-4 py-3 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-[var(--border-color)]"
              style={{
                resize: "none",
                minHeight: "44px",
                maxHeight: "200px",
              }}
            />
            <button
              onClick={() => handleSendMessage(message)}
              disabled={isLoading || !message.trim()}
              className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon
                aria-hidden="true"
                className="size-6 text-white"
              />
            </button>
          </div>
          {/* <p className="text-xs text-center text-gray-500 mt-2">
            AI Assistant is ready to help analyze your calls and provide
            insights.
          </p> */}
        </div>
      </div>
    )
  }
)
