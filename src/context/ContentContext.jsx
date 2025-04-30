import { useContext, createContext, useState } from "react"

const ContentContext = createContext()

export function ContentProvider({ children }) {
  const content = useContentProvider()
  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  )
}

export const useContent = () => {
  return useContext(ContentContext)
}

function useContentProvider() {
  const [messageHistoryByUserId, setMessageHistoryByUserId] = useState({
    today: [],
    yesterday: [],
    older: [],
  })
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const [isLoadingChatPerSession, setIsLoadingChatPerSession] = useState(true)
  const [agentError, setAgentError] = useState(null)
  const [chatHistoryPerSessioin, setChatHistoryPerSession] = useState([])

  function saveMessageHistoryByUserId(setMessageHistoryByUserIdParam) {
    setMessageHistoryByUserId(setMessageHistoryByUserIdParam)
  }

  // This function is used to set the loading state for the conversations/chat by user.
  function saveLoadingConversationsStatus(isLoading) {
    setIsLoadingConversations(isLoading)
  }

  // This function is used to set the loading state for the chat per session.
  function saveLoadingChatPerSessionStatus(isLoading) {
    setIsLoadingChatPerSession(isLoading)
  }

  // This function is used to set the chat history for the session.
  function saveChatHistoryPerSession(chatHistory) {
    setChatHistoryPerSession(chatHistory)
  }

  function saveAgentErrorStatus(isError) {
    setAgentError(isError)
  }

  return {
    messageHistoryByUserId,
    saveMessageHistoryByUserId,
    isLoadingConversations,
    saveLoadingConversationsStatus,
    agentError,
    saveAgentErrorStatus,
    isLoadingChatPerSession,
    saveLoadingChatPerSessionStatus,
    chatHistoryPerSessioin,
    saveChatHistoryPerSession,
  }
}
