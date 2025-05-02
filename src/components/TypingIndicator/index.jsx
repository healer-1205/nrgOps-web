import { memo } from "react"

export const TypingIndicator = memo(() => (
  <div className="flex items-end space-x-1 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] w-16">
    <div
      className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce"
      style={{ animationDelay: "0ms", animationDuration: "600ms" }}
    />
    <div
      className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce"
      style={{ animationDelay: "150ms", animationDuration: "600ms" }}
    />
    <div
      className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce"
      style={{ animationDelay: "300ms", animationDuration: "600ms" }}
    />
  </div>
))
