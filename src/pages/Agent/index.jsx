import { useState, useRef, useCallback, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  PaperAirplaneIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/outline"
import { ChevronRightIcon } from "@heroicons/react/20/solid"
import { v4 as uuidv4 } from "uuid"
import { API_URL } from "../../utils/constants"

const QuickActions = [
  {
    title: "📋 Today's Leads",
    description: "How much production did we generate today as a company?",
  },
  {
    title: "🏆 Top Leads",
    description: "When was the latest oil pick up?",
  },
  {
    title: "🆕 New Leads",
    description: "What are our least performing wells?",
  },
  {
    title: "🚀 NrgOps AI",
    description: "What is our expected revenue this month?",
  },
]

const InputArea = ({
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
          : "sticky bottom-0 w-full border-t p-4"
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
            disabled={isLoading}
            className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon
              aria-hidden="true"
              className="size-6 cursor-pointer"
            />
          </button>
        </div>
        <p className="text-xs text-center text-gray-500 mt-2">
          AI Assistant is ready to help analyze your calls and provide insights.
        </p>
      </div>
    </div>
  )
}

const TypingIndicator = () => (
  <div className="flex items-end space-x-1 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 w-16">
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
)

const ChatMessage = ({ message, from }) => (
  <div
    className={`flex ${from === "user" ? "justify-end" : "justify-start"} mb-4`}
  >
    <div
      className={`flex ${
        from === "user" ? "flex-row-reverse" : "flex-row"
      } items-end max-w-3xl gap-2`}
    >
      <div className={`flex-shrink-0 ${from === "user" ? "ml-2" : "mr-2"}`}>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            from === "user"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
          }`}
        >
          {from === "user" ? (
            <User className="w-5 h-5" />
          ) : (
            <Bot className="w-5 h-5" />
          )}
        </div>
      </div>
      <div
        className={`px-4 py-2 rounded-lg ${
          from === "user"
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"
        }`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          className="prose dark:prose-invert max-w-none"
        >
          {message}
        </ReactMarkdown>
      </div>
    </div>
  </div>
)

export const Agent = () => {
  const [message, setMessage] = useState("")
  const [chatMessages, setChatMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const [currentSessionId, setCurrentSessionId] = useState(null)
  const [conversations, setConversations] = useState({
    today: [],
    yesterday: [],
    older: [],
  })
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)
  const initialLoadRef = useRef(false)

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const fetchMessageHistoryBySession = useCallback(async (sessionId) => {
    if (!sessionId) {
      setError("Invalid session ID")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const url = `${API_URL}/message-history/${sessionId}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(
          `Failed to fetch session history: ${response.statusText}`
        )
      }

      const data = await response.json()

      if (!data || typeof data !== "object") {
        throw new Error("Invalid response format")
      }

      let messages = []
      if (Array.isArray(data.history)) {
        messages = data.history
      } else if (Array.isArray(data.messages)) {
        messages = data.messages
      } else {
        throw new Error("Messages data is not in the expected format")
      }

      const formattedMessages = messages.map((msg) => ({
        from:
          (msg.sender || msg.role || "").toString().toUpperCase() === "USER"
            ? "user"
            : "bot",
        message: msg.content || msg.message || "",
      }))

      if (formattedMessages.length > 0) {
        setChatMessages(formattedMessages)
        setCurrentSessionId(sessionId)
      } else {
        setChatMessages([])
      }
    } catch (error) {
      console.error("Error fetching session history:", error)
      setError("Failed to load chat history. Please try again.")
      setChatMessages([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchConversations = useCallback(async () => {
    try {
      setIsLoadingConversations(true)
      const id_usuario = localStorage.getItem("id")
      const response = await fetch(
        `${API_URL}/message-history-user-id/${id_usuario}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch conversations")
      }

      const data = await response.json()

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      const todayChats = []
      const yesterdayChats = []
      const olderChats = []

      if (data.status === "success" && Array.isArray(data.history)) {
        data.history.forEach((chat) => {
          const firstMessage = chat.messages[0]
          const lastMessage = chat.messages[chat.messages.length - 1]

          const formattedChat = {
            id: chat.id,
            session_id: chat.id,
            title: firstMessage.message?.slice(0, 30) + "..." || "Sem título",
            preview: lastMessage.message?.slice(0, 40) + "..." || "Sem preview",
            timestamp: firstMessage.timestamp || new Date().toISOString(),
          }

          const chatDate = new Date(formattedChat.timestamp)
          chatDate.setHours(0, 0, 0, 0)

          if (chatDate.getTime() === today.getTime()) {
            todayChats.push(formattedChat)
          } else if (chatDate.getTime() === yesterday.getTime()) {
            yesterdayChats.push(formattedChat)
          } else {
            olderChats.push(formattedChat)
          }
        })
      }

      setConversations({
        today: todayChats.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        ),
        yesterday: yesterdayChats.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        ),
        older: olderChats.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        ),
      })
    } catch (error) {
      console.error("Error fetching conversations:", error)
      setError("Failed to load conversations. Please try again.")
    } finally {
      setIsLoadingConversations(false)
    }
  }, [])

  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true
    }
  }, [])

  // Fetch conversations when the component mounts everytime the user focuses the window
  // or when the visibility changes

  // useEffect(() => {
  //   const handleFocus = () => {
  //     fetchConversations()
  //   }

  //   window.addEventListener("focus", handleFocus)
  //   document.addEventListener("visibilitychange", () => {
  //     if (document.visibilityState === "visible") {
  //       handleFocus()
  //     }
  //   })

  //   return () => {
  //     window.removeEventListener("focus", handleFocus)
  //     document.removeEventListener("visibilitychange", handleFocus)
  //   }
  // }, [fetchConversations])

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return

    let sessionIdToUse = currentSessionId
    if (!sessionIdToUse) {
      sessionIdToUse = uuidv4()
      setCurrentSessionId(sessionIdToUse)
    }

    const newMessage = { from: "user", message: messageText.trim() }
    setChatMessages((prev) => [...prev, newMessage])
    setMessage("")
    setIsLoading(true)
    setError(null)

    scrollToBottom()

    try {
      const response = await fetch(`${API_URL}/api/agent/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: messageText,
          session_id: sessionIdToUse,
          id_usuario: localStorage.getItem("id") || "",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const data = await response.json()

      setChatMessages((prev) => [
        ...prev,
        {
          from: "bot",
          message: data.response,
        },
      ])

      scrollToBottom()

      await fetchConversations()
    } catch (error) {
      console.error("Error sending message:", error)
      setError("Failed to send message. Please try again.")
      setChatMessages((prev) => [
        ...prev,
        {
          from: "bot",
          message: "Sorry, I couldn't process your request. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages, isLoading])

  const startNewChat = () => {
    setChatMessages([])
    setMessage("")
    setCurrentSessionId(uuidv4())
    setError(null)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(message)
    }
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages, isLoading])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  return (
    <div className="flex w-full h-full gap-x-4">
      <div className="w-full shadow-md rounded-md p-4 min-h-[calc(100vh-144px)] bg-[var(--bg-primary)]">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto">
            {chatMessages.length === 0 ? (
              <div className="flex flex-col items-center max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold mb-2 text-center">
                  Your AI Agent
                </h2>
                <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mb-6">
                  {QuickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(action.description)}
                      className="p-3 rounded-lg text-left hover:bg-[var(--bg-hover)] transition-colors group bg-[var(--bg-secondary)] cursor-pointer"
                      disabled={isLoading || isLoadingConversations}
                    >
                      <h3 className="text-sm font-medium flex items-center justify-between">
                        {action.title}
                        <ChevronRightIcon
                          aria-hidden="true"
                          className="ml-2 size-5"
                        />
                      </h3>
                      <p className="text-sm mt-1">{action.description}</p>
                    </button>
                  ))}
                </div>

                <InputArea
                  isStandalone={true}
                  message={message}
                  setMessage={setMessage}
                  handleSendMessage={handleSendMessage}
                  isLoading={isLoading || isLoadingConversations}
                  handleKeyDown={handleKeyDown}
                />
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-4 mb-4">
                {error && (
                  <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-lg">
                    {error}
                  </div>
                )}
                {chatMessages.map((msg, index) => (
                  <ChatMessage key={index} {...msg} />
                ))}
                {isLoading && (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                      <ChatBubbleLeftEllipsisIcon
                        aria-hidden="true"
                        className="size-6 text-white cursor-pointer"
                      />
                    </div>
                    <TypingIndicator />
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {chatMessages.length > 0 && (
            <InputArea
              message={message}
              setMessage={setMessage}
              handleSendMessage={handleSendMessage}
              isLoading={isLoading || isLoadingConversations}
              handleKeyDown={handleKeyDown}
            />
          )}
        </div>
      </div>
    </div>
  )
}
