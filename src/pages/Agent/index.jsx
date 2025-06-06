import { useState, useRef, useCallback, useEffect, memo } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { UserIcon, BugAntIcon } from "@heroicons/react/24/outline"
import { ChevronRightIcon } from "@heroicons/react/20/solid"
import { v4 as uuidv4 } from "uuid"
import { API_URL } from "../../utils/constants"
import { useContent } from "../../context/ContentContext"
import axiosInstance from "../../utils/axios"
import { processChatHistoryByUserId } from "../../utils/processChatHistoryByUserId"
import { QuickActions } from "../../utils/constants"
import { TypingIndicator } from "../../components/TypingIndicator"
import { InputArea } from "../../components/InputArea"

const ChatMessage = memo(({ message, from }) => {
  return (
    <div
      className={`flex ${
        from === "user" ? "justify-end" : "justify-start"
      } mb-4`}
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
                ? "bg-indigo-500 text-white"
                : "bg-[var(--bg-secondary)] text-[var(--text-primary)]"
            }`}
          >
            {from === "user" ? (
              <UserIcon aria-hidden="true" className="size-6 text-white" />
            ) : (
              <BugAntIcon
                aria-hidden="true"
                className="size-6 text-[var(--text-primary)]"
              />
            )}
          </div>
        </div>
        <div
          className={`px-4 py-2 rounded-lg ${
            from === "user"
              ? "bg-indigo-500 text-white rounded-br-none"
              : "bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-bl-none"
          }`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks, remarkParse, remarkRehype]}
          >
            {message}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
})

export const Agent = () => {
  const [message, setMessage] = useState("") // State to hold the current message input
  const [uploadedFiles, setUploadedFiles] = useState([])
  const messagesEndRef = useRef(null)
  const abortControllerRef = useRef(null)
  const savedData = useContent()
  const [
    userMessageHistoryDataPerSession,
    setUserMessageHistoryDataPerSession,
  ] = useState(savedData.chatHistoryPerSessioin)
  const [currentSessionId, setCurrentSessionId] = useState(
    savedData.selectedSession
  )
  const [isLoadingChatPerSession, setIsLoadingChatPerSession] = useState(
    savedData.isLoadingChatPerSession
  )
  const [isLoadingConversations, setIsLoadingConversations] = useState(
    savedData.isLoadingConversations
  )
  const [error, setError] = useState(savedData.agentError)

  useEffect(() => {
    fetchConversationsByUserId()

    // Set up a cleanup function to abort any ongoing API requests when the component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // This effect is used to update the chat history per session whenever the savedData changes
  // This is important to ensure that the chat history is always in sync with the latest data
  useEffect(() => {
    setUserMessageHistoryDataPerSession(savedData.chatHistoryPerSessioin)
  }, [savedData.chatHistoryPerSessioin])

  // This effect is used to update the current session ID whenever the savedData changes
  // This is important to ensure that the current session ID is always in sync with the latest data
  useEffect(() => {
    setCurrentSessionId(savedData.selectedSession)
  }, [savedData.selectedSession])

  // This effect is used to update the loading state for chat per session whenever the savedData changes
  // This is important to ensure that the loading state is always in sync with the latest data
  useEffect(() => {
    setIsLoadingChatPerSession(savedData.isLoadingChatPerSession)
  }, [savedData.isLoadingChatPerSession])

  // This effect is used to update the loading state for conversations whenever the savedData changes
  // This is important to ensure that the loading state is always in sync with the latest data
  useEffect(() => {
    setIsLoadingConversations(savedData.isLoadingConversations)
  }, [savedData.isLoadingConversations])

  // This effect is used to update the error state whenever the savedData changes
  // This is important to ensure that the error state is always in sync with the latest data
  useEffect(() => {
    setError(savedData.agentError)
  }, [savedData.agentError])

  // This effect is used to scroll to the bottom of the chat messages whenever the chat messages change
  // This is important to ensure that the user always sees the latest messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [isLoadingChatPerSession])

  const fetchConversationsByUserId = useCallback(async () => {
    try {
      await savedData.saveLoadingConversationsStatus(true)
      const userId = localStorage.getItem("id")
      const response = await axiosInstance({
        method: "get",
        url: `${API_URL}/api/agent/messageHistoryByUserId/${userId}`,
      })

      const data = response.data

      const sortedConversations = processChatHistoryByUserId(data)
      await savedData.saveMessageHistoryByUserId(sortedConversations)
    } catch (error) {
      console.error("Error fetching conversations:", error)
      setError("Failed to load conversations. Please try again.")
    } finally {
      savedData.saveLoadingConversationsStatus(false)
    }
  }, [savedData])

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return

    let sessionIdToUse = currentSessionId
    if (!sessionIdToUse) {
      sessionIdToUse = uuidv4()
      savedData.saveSelectedSession(sessionIdToUse)
    }

    const newMessage = { from: "user", message: messageText.trim() }
    setUserMessageHistoryDataPerSession((prev) => [...prev, newMessage])
    setMessage("")
    setIsLoadingChatPerSession(true)
    setError(null)

    try {
      const payload = {
        prompt: messageText,
        sessionId: sessionIdToUse,
        userId: localStorage.getItem("id") || "",
        fileIds: uploadedFiles?.map((f) => f.fileId),
      }

      const response = await axiosInstance({
        method: "post",
        url: `${API_URL}/api/agent/process-query`,
        data: payload,
      })

      setUserMessageHistoryDataPerSession((prev) => [
        ...prev,
        {
          from: "bot",
          message: response.data.response,
        },
      ])

      await fetchConversationsByUserId()
    } catch (error) {
      console.error("Error sending message:", error)
      setError("Failed to send message. Please try again.")
      setUserMessageHistoryDataPerSession((prev) => [
        ...prev,
        {
          from: "bot",
          message: "Sorry, I couldn't process your request. Please try again.",
        },
      ])
    } finally {
      setIsLoadingChatPerSession(false)
    }
  }

  return (
    <div className="flex w-full h-full gap-x-4">
      <div className="w-full shadow-md rounded-md p-4 min-h-[calc(100vh-144px)] bg-[var(--bg-primary)]">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto">
            {userMessageHistoryDataPerSession.length === 0 ? (
              <div className="flex flex-col items-center max-w-5xl mx-auto">
                <h2 className="text-2xl font-semibold mb-2 text-center">
                  Your AI Agent
                </h2>
                <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-6">
                  {QuickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(action.description)}
                      className="p-3 rounded-md text-left hover:bg-[var(--bg-hover)] transition-colors group bg-[var(--bg-secondary)] cursor-pointer"
                      disabled={
                        isLoadingChatPerSession || isLoadingConversations
                      }
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
                  isLoading={isLoadingChatPerSession || isLoadingConversations}
                  setUploadedFiles={setUploadedFiles}
                  uploadedFiles={uploadedFiles}
                />
              </div>
            ) : (
              <div className="max-w-5xl mx-auto space-y-4 mb-4">
                {userMessageHistoryDataPerSession.map((msg, index) => (
                  <ChatMessage key={index} {...msg} />
                ))}
                {isLoadingChatPerSession && (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                      <BugAntIcon
                        aria-hidden="true"
                        className="size-6 text-white cursor-pointer"
                      />
                    </div>
                    <TypingIndicator />
                  </div>
                )}
                {error && (
                  <div className="mb-4 p-4 bg-red-500 text-gray-100 rounded-lg">
                    {error}
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {userMessageHistoryDataPerSession.length > 0 && (
            <InputArea
              isStandalone={false}
              message={message}
              setMessage={setMessage}
              handleSendMessage={handleSendMessage}
              isLoading={isLoadingChatPerSession || isLoadingConversations}
              setUploadedFiles={setUploadedFiles}
              uploadedFiles={uploadedFiles}
            />
          )}
        </div>
      </div>
    </div>
  )
}
