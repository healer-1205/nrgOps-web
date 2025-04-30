export const processChatHistoryByUserId = (data) => {
  if (!data || data.status !== "success" || !Array.isArray(data.history)) {
    return {
      today: [],
      yesterday: [],
      older: [],
    }
  }

  // Create timestamps once
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const todayTimestamp = today.getTime()
  const yesterdayTimestamp = yesterday.getTime()

  // Use Map for efficient categorization
  const chatMap = new Map([
    [todayTimestamp, []],
    [yesterdayTimestamp, []],
    [null, []], // For older chats
  ])

  // Process each chat
  data.history.forEach((chat) => {
    const firstMessage = chat.messages[0]
    const lastMessage = chat.messages[chat.messages.length - 1]

    const formattedChat = {
      id: chat.sessionId,
      session_id: chat.sessionId,
      title: firstMessage?.chat?.slice(0, 30) + "..." || "No Title",
      preview: lastMessage?.chat?.slice(0, 40) + "..." || "See Preview",
      timestamp: firstMessage?.createdAt || new Date().toISOString(),
    }

    const chatDate = new Date(formattedChat.timestamp)
    chatDate.setHours(0, 0, 0, 0)
    const chatTimestamp = chatDate.getTime()

    if (chatTimestamp === todayTimestamp) {
      chatMap.get(todayTimestamp).push(formattedChat)
    } else if (chatTimestamp === yesterdayTimestamp) {
      chatMap.get(yesterdayTimestamp).push(formattedChat)
    } else {
      chatMap.get(null).push(formattedChat)
    }
  })

  // Sort each category
  const sortByTimestamp = (a, b) =>
    new Date(b.timestamp) - new Date(a.timestamp)
  return {
    today: chatMap.get(todayTimestamp).sort(sortByTimestamp),
    yesterday: chatMap.get(yesterdayTimestamp).sort(sortByTimestamp),
    older: chatMap.get(null).sort(sortByTimestamp),
  }
}
