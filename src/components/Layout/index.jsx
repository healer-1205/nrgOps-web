import { useState, useEffect, Fragment, useRef } from "react"
import { useLocation, NavLink } from "react-router"
import { Link, useNavigate } from "react-router-dom"
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react"
import {
  Bars3Icon,
  BellIcon,
  Cog6ToothIcon,
  HomeIcon,
  SquaresPlusIcon,
  CircleStackIcon,
  UserGroupIcon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  PencilSquareIcon,
  TrashIcon,
  EllipsisVerticalIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline"
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"
import { useContent } from "../../context/ContentContext"
import assets from "../../assets"
import { API_URL } from "../../utils/constants"
import axiosInstance from "../../utils/axios"
import { processChatHistoryByUserId } from "../../utils/processChatHistoryByUserId"

const userNavigation = [{ name: "Your profile", href: "/" }]

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const ChatItem = ({ chat, onDelete, isActive, onSelect }) => {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleDeleteClick = () => {
    onDelete()
    setShowMenu(false)
  }

  const handleSelect = () => {
    onSelect()
  }

  return (
    <>
      <div
        className={`relative flex items-center p-3 rounded-lg mb-2 transition-colors duration-200 cursor-pointer ${
          isActive ? "bg-blue-900" : "bg-gray-800 hover:bg-gray-700"
        }`}
        onClick={handleSelect}
      >
        <div className="flex-1 text-left overflow-hidden">
          <div className="text-sm font-medium text-gray-100 truncate">
            {chat.title}
          </div>
          <div className="text-xs text-gray-400 truncate">{chat.preview}</div>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="ml-2 p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <EllipsisVerticalIcon className="size-4 text-gray-400" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg z-50 text-sm">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteClick()
                }}
                className="w-full flex items-center gap-2 p-2 text-red-500 hover:bg-gray-600 rounded-lg cursor-pointer"
              >
                <TrashIcon aria-hidden="true" className="size-4" />
                Delete Conversation
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export const Layout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [navigation, setNavigation] = useState([])
  const { isDarkMode, toggleTheme } = useTheme()
  const savedData = useContent()
  const [userMessageHistoryData, setUserMessageHistoryData] = useState(
    savedData.messageHistoryByUserId
  )
  const [loadingConversationStatus, setIsLoadingConversationStatus] = useState(
    savedData.isLoadingConversations
  )
  const [currentSessionId, setCurrentSessionId] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedChatTitle, setSelectedChatTitle] = useState("")
  const id = localStorage.getItem("id")

  useEffect(() => {
    setNavigation([
      { name: "Dashboard", href: "/", icon: HomeIcon, current: true },
      {
        name: "Database",
        href: "/database",
        icon: CircleStackIcon,
        current: false,
      },
      {
        name: "Plugins",
        href: "/plugins",
        icon: SquaresPlusIcon,
        current: false,
      },
      {
        name: "Setting",
        href: "/setting",
        icon: Cog6ToothIcon,
        current: false,
      },
    ])
  }, [])

  useEffect(() => {
    setUserMessageHistoryData(savedData.messageHistoryByUserId)
  }, [savedData.messageHistoryByUserId])

  useEffect(() => {
    setIsLoadingConversationStatus(savedData.isLoadingConversations)
  }, [savedData.isLoadingConversations])

  useEffect(() => {
    axiosInstance({
      method: "get",
      url: `${API_URL}/api/users/userId/${id}`,
    })
      .then((res) => {
        auth.saveUser(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
    // eslint-disable-next-line
  }, [id])

  const fetchMessageHistoryBySession = async (sessionId) => {
    if (!sessionId) {
      savedData.saveAgentErrorStatus("Invalid session ID")
      return
    }
    try {
      savedData.saveLoadingChatPerSessionStatus(true)
      savedData.saveAgentErrorStatus(null)

      const response = await axiosInstance({
        method: "get",
        url: `${API_URL}/api/agent/messagesBySessionId/${sessionId}`,
      })
      const data = response.data
      const messages = Array.isArray(data.history.messages)
        ? data.history.messages
        : data.messages

      const formattedMessages = messages.map((msg) => ({
        from:
          (msg.sender || msg.role || "").toString().toUpperCase() === "USER"
            ? "user"
            : "bot",
        message: msg.chat || "",
      }))
      console.log("formattedMessages:", formattedMessages)
      if (formattedMessages.length > 0) {
        savedData.saveChatHistoryPerSession(formattedMessages)
        setCurrentSessionId(sessionId)
      } else {
        savedData.saveChatHistoryPerSession([])
      }
    } catch (error) {
      console.error("Error fetching message session:", error)
      savedData.saveAgentErrorStatus()
      savedData.saveChatHistoryPerSession([])
    } finally {
      savedData.saveLoadingChatPerSessionStatus(false)
    }
  }

  return (
    <div>
      <Dialog
        open={sidebarOpen}
        onClose={setSidebarOpen}
        className="relative z-10 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />

        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="-m-2.5 p-2.5"
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                </button>
              </div>
            </TransitionChild>
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
              <div className="flex h-16 shrink-0 items-center">
                <p className="text-xl text-white">NrgOps</p>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation?.map((item) => (
                        <li key={item.name}>
                          {!item.children ? (
                            <NavLink
                              to={item.href || "#"}
                              className={({ isActive }) =>
                                classNames(
                                  isActive
                                    ? "bg-gray-800 text-white"
                                    : "text-white hover:bg-gray-700 hover:text-white",
                                  "group flex items-center px-2 py-2 text-sm font-medium gap-x-3 rounded-md"
                                )
                              }
                            >
                              <item.icon
                                className="h-6 w-6 shrink-0 text-gray-300"
                                aria-hidden="true"
                              />
                              {item.name}
                            </NavLink>
                          ) : (
                            <Disclosure
                              as="div"
                              defaultOpen={item?.children?.some((child) =>
                                location.pathname.startsWith(child.href)
                              )}
                            >
                              {({ open }) => (
                                <>
                                  <DisclosureButton
                                    className={classNames(
                                      item.current
                                        ? "bg-gray-900"
                                        : "text-white hover:bg-gray-700 hover:text-white",
                                      "flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold"
                                    )}
                                  >
                                    <item.icon
                                      className="h-6 w-6 shrink-0 text-gray-300"
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                    <ChevronRightIcon
                                      className={classNames(
                                        open
                                          ? "rotate-90 text-white"
                                          : "text-white",
                                        "ml-auto h-5 w-5 shrink-0"
                                      )}
                                      aria-hidden="true"
                                    />
                                  </DisclosureButton>
                                  {
                                    <DisclosurePanel
                                      as="ul"
                                      className="mt-1 px-2"
                                    >
                                      {item?.children?.map((subItem) => (
                                        <li key={subItem.name}>
                                          {/* 44px */}
                                          <NavLink
                                            to={subItem.href || "#"}
                                            className={({ isActive }) =>
                                              classNames(
                                                isActive
                                                  ? "bg-gray-800"
                                                  : "text-white hover:bg-gray-700 hover:text-white",
                                                "block rounded-md py-2 pr-2 pl-9 text-sm leading-6"
                                              )
                                            }
                                          >
                                            {subItem.name}
                                          </NavLink>
                                        </li>
                                      ))}
                                    </DisclosurePanel>
                                  }
                                </>
                              )}
                            </Disclosure>
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="border-t border-gray-800 pt-4">
                    <ul role="list" className="-mx-2 space-y-1">
                      <li>
                        <NavLink
                          to="/agent"
                          className={({ isActive }) =>
                            classNames(
                              isActive
                                ? "bg-gray-800 text-white"
                                : "text-white hover:bg-gray-700 hover:text-white",
                              "group flex items-center justify-between px-2 py-2 text-sm font-medium gap-x-3 rounded-md"
                            )
                          }
                        >
                          <div className="flex items-center gap-x-3">
                            <UserGroupIcon
                              className="h-6 w-6 shrink-0 text-gray-300"
                              aria-hidden="true"
                            />
                            Agent
                          </div>
                          <div className="flex items-center gap-x-3">
                            <MagnifyingGlassIcon
                              aria-hidden="true"
                              className="size-6 text-gray-300"
                            />
                            <PencilSquareIcon
                              aria-hidden="true"
                              className="size-6 text-gray-300"
                            />
                          </div>
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                  <li>
                    {loadingConversationStatus ? (
                      <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                        <p className="text-sm text-gray-400">
                          Loading conversations...
                        </p>
                      </div>
                    ) : (
                      <Fragment>
                        {userMessageHistoryData.today.length > 0 && (
                          <div className="space-y-1 mb-4">
                            <p className="text-xs font-medium text-gray-400 px-3 py-2">
                              Today
                            </p>
                            {userMessageHistoryData.today.map((chat) => (
                              <ChatItem
                                key={chat.session_id}
                                chat={chat}
                                onSelect={() =>
                                  fetchMessageHistoryBySession(chat.session_id)
                                }
                                onDelete={() => {
                                  setSelectedChatTitle(chat.title)
                                  setCurrentSessionId(chat.session_id)
                                  setShowDeleteModal(true)
                                }}
                                isActive={chat.session_id === currentSessionId}
                              />
                            ))}
                          </div>
                        )}
                        {userMessageHistoryData.yesterday.length > 0 && (
                          <div className="space-y-1 mb-4">
                            <p className="text-xs font-medium text-gray-400 px-3 py-2">
                              Yesterday
                            </p>
                            {userMessageHistoryData.yesterday.map((chat) => (
                              <ChatItem
                                key={chat.session_id}
                                chat={chat}
                                onSelect={() =>
                                  fetchMessageHistoryBySession(chat.session_id)
                                }
                                onDelete={() => {
                                  setSelectedChatTitle(chat.title)
                                  setCurrentSessionId(chat.session_id)
                                  setShowDeleteModal(true)
                                }}
                                isActive={chat.session_id === currentSessionId}
                              />
                            ))}
                          </div>
                        )}
                        {userMessageHistoryData.older.length > 0 && (
                          <div className="space-y-1 mb-4">
                            <p className="text-xs font-medium text-gray-400 px-3 py-2">
                              Older
                            </p>
                            {userMessageHistoryData.older.map((chat) => (
                              <ChatItem
                                key={chat.session_id}
                                chat={chat}
                                onSelect={() =>
                                  fetchMessageHistoryBySession(chat.session_id)
                                }
                                onDelete={() => {
                                  setSelectedChatTitle(chat.title)
                                  setCurrentSessionId(chat.session_id)
                                  setShowDeleteModal(true)
                                }}
                                isActive={chat.session_id === currentSessionId}
                              />
                            ))}
                          </div>
                        )}
                      </Fragment>
                    )}
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-10 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center m-auto">
            <p className="text-3xl text-white">NrgOps</p>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation?.length > 0 &&
                    navigation.map((item) => (
                      <li key={item.name}>
                        {!item.children ? (
                          <NavLink
                            to={item.href || "#"}
                            className={({ isActive }) =>
                              classNames(
                                isActive
                                  ? "bg-gray-800 text-white"
                                  : "text-white hover:bg-gray-700 hover:text-white",
                                "group flex items-center px-2 py-2 text-sm font-medium gap-x-3 rounded-md"
                              )
                            }
                          >
                            {item.icon && (
                              <item.icon
                                className="h-6 w-6 shrink-0 text-gray-300"
                                aria-hidden="true"
                              />
                            )}
                            {item.name}
                          </NavLink>
                        ) : (
                          <Disclosure
                            as="div"
                            defaultOpen={
                              item?.children?.length > 0 &&
                              item.children.some((child) =>
                                location.pathname.startsWith(child.href)
                              )
                            }
                          >
                            {({ open }) => (
                              <>
                                <DisclosureButton
                                  className={classNames(
                                    item.current
                                      ? "bg-gray-900"
                                      : "text-white hover:bg-gray-700 hover:text-white",
                                    "flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold"
                                  )}
                                >
                                  <item.icon
                                    className="h-6 w-6 shrink-0 text-gray-300"
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                  <ChevronRightIcon
                                    className={classNames(
                                      open
                                        ? "rotate-90 text-white"
                                        : "text-white",
                                      "ml-auto h-5 w-5 shrink-0"
                                    )}
                                    aria-hidden="true"
                                  />
                                </DisclosureButton>
                                {
                                  <DisclosurePanel
                                    as="ul"
                                    className="mt-1 px-2"
                                  >
                                    {item?.children?.map((subItem) => (
                                      <li key={subItem.name}>
                                        {/* 44px */}
                                        <NavLink
                                          to={subItem.href || "#"}
                                          className={({ isActive }) =>
                                            classNames(
                                              isActive
                                                ? "bg-gray-800"
                                                : "text-white hover:bg-gray-700 hover:text-white",
                                              "block rounded-md py-2 pr-2 pl-9 text-sm leading-6"
                                            )
                                          }
                                        >
                                          {subItem.name}
                                        </NavLink>
                                      </li>
                                    ))}
                                  </DisclosurePanel>
                                }
                              </>
                            )}
                          </Disclosure>
                        )}
                      </li>
                    ))}
                </ul>
              </li>
              <li className="border-t border-gray-800 pt-4">
                <ul role="list" className="-mx-2 space-y-1">
                  <li>
                    <NavLink
                      to="/agent"
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? "bg-gray-800 text-white"
                            : "text-white hover:bg-gray-700 hover:text-white",
                          "group flex items-center justify-between px-2 py-2 text-sm font-medium gap-x-3 rounded-md"
                        )
                      }
                    >
                      <div className="flex items-center gap-x-3">
                        <UserGroupIcon
                          className="h-6 w-6 shrink-0 text-gray-300"
                          aria-hidden="true"
                        />
                        Agent
                      </div>
                      <div className="flex items-center gap-x-3">
                        <MagnifyingGlassIcon
                          aria-hidden="true"
                          className="size-6 text-gray-300"
                          onClick={() => {
                            alert("Search clicked")
                          }}
                        />
                        <PencilSquareIcon
                          aria-hidden="true"
                          className="size-6 text-gray-300"
                          onClick={() => {
                            alert("New clicked")
                          }}
                        />
                      </div>
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li>
                {loadingConversationStatus ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                    <p className="text-sm text-gray-400">
                      Loading conversations...
                    </p>
                  </div>
                ) : (
                  <Fragment>
                    {userMessageHistoryData.today.length > 0 && (
                      <div className="space-y-1 mb-4">
                        <p className="text-xs font-medium text-gray-400 px-3 py-2">
                          Today
                        </p>
                        {userMessageHistoryData.today.map((chat) => (
                          <ChatItem
                            key={chat.session_id}
                            chat={chat}
                            onSelect={() =>
                              fetchMessageHistoryBySession(chat.session_id)
                            }
                            onDelete={() => {
                              setSelectedChatTitle(chat.title)
                              setCurrentSessionId(chat.session_id)
                              setShowDeleteModal(true)
                            }}
                            isActive={chat.session_id === currentSessionId}
                          />
                        ))}
                      </div>
                    )}
                    {userMessageHistoryData.yesterday.length > 0 && (
                      <div className="space-y-1 mb-4">
                        <p className="text-xs font-medium text-gray-400 px-3 py-2">
                          Yesterday
                        </p>
                        {userMessageHistoryData.yesterday.map((chat) => (
                          <ChatItem
                            key={chat.session_id}
                            chat={chat}
                            onSelect={() =>
                              fetchMessageHistoryBySession(chat.session_id)
                            }
                            onDelete={() => {
                              setSelectedChatTitle(chat.title)
                              setCurrentSessionId(chat.session_id)
                              setShowDeleteModal(true)
                            }}
                            isActive={chat.session_id === currentSessionId}
                          />
                        ))}
                      </div>
                    )}
                    {userMessageHistoryData.older.length > 0 && (
                      <div className="space-y-1 mb-4">
                        <p className="text-xs font-medium text-gray-400 px-3 py-2">
                          Older
                        </p>
                        {userMessageHistoryData.older.map((chat) => (
                          <ChatItem
                            key={chat.session_id}
                            chat={chat}
                            onSelect={() =>
                              fetchMessageHistoryBySession(chat.session_id)
                            }
                            onDelete={() => {
                              setSelectedChatTitle(chat.title)
                              setCurrentSessionId(chat.session_id)
                              setShowDeleteModal(true)
                            }}
                            isActive={chat.session_id === currentSessionId}
                          />
                        ))}
                      </div>
                    )}
                  </Fragment>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8 bg-[var(--header-bg)] border-[var(--border-color)]">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>

          {/* Separator */}
          <div
            aria-hidden="true"
            className="h-6 w-px bg-gray-900/10 lg:hidden"
          />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <form action="#" method="GET" className="grid flex-1 grid-cols-1">
              <input
                name="search"
                type="search"
                placeholder="Search"
                aria-label="Search"
                className="col-start-1 row-start-1 block size-full pl-8 text-base outline-hidden placeholder:text-gray-400 sm:text-sm/6"
              />
              <MagnifyingGlassIcon
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400"
              />
            </form>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button
                type="button"
                onClick={toggleTheme}
                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                style={{
                  backgroundColor: isDarkMode ? "#374151" : "#e5e7eb",
                }}
              >
                <span className="sr-only">Toggle theme</span>
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out ${
                    isDarkMode ? "translate-x-5" : "translate-x-0"
                  }`}
                >
                  {isDarkMode ? (
                    <SunIcon className="h-5 w-5 text-yellow-400" />
                  ) : (
                    <MoonIcon className="h-5 w-5 text-gray-600" />
                  )}
                </span>
              </button>

              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="size-6" />
              </button>

              {/* Separator */}
              <div
                aria-hidden="true"
                className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
              />

              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <MenuButton className="-m-1.5 flex items-center p-1.5 hover:cursor-pointer">
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt="profile image"
                    src={assets.Avatar}
                    className="size-8 rounded-full bg-gray-50"
                  />
                  <span className="hidden lg:flex lg:items-center">
                    <span
                      aria-hidden="true"
                      className="ml-4 text-sm/6 font-semibold"
                    >
                      {auth?.account?.email}
                    </span>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="ml-2 size-5 text-gray-400"
                    />
                  </span>
                </MenuButton>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md py-2 ring-1 shadow-lg ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in bg-[var(--bg-primary)]"
                >
                  {userNavigation.map((item) => (
                    <MenuItem key={item.name}>
                      <Link
                        to={item.href}
                        className="block px-3 py-1 text-sm/6 data-focus:outline-hidden"
                      >
                        {item.name}
                      </Link>
                    </MenuItem>
                  ))}
                  <MenuItem>
                    <button
                      className="block px-3 py-1 text-sm/6 data-focus:outline-hidden cursor-pointer hover:text-indigo-500"
                      onClick={() => {
                        localStorage.removeItem("accessToken")
                        navigate("/signin")
                      }}
                    >
                      Sign out
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>

        <main className="py-10 min-h-[calc(100vh-64px)] bg-[var(--bg-secondary)]">
          <div className="px-4 sm:px-6 lg:px-8 text-[var(--text-primary)]">
            {children}
          </div>
        </main>
      </div>

      {/* chat session delete confirm modal */}
      <Dialog
        open={showDeleteModal}
        onClose={setShowDeleteModal}
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
              className="relative transform overflow-hidden rounded-lg bg-[var(--bg-primary)] px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                  <ExclamationTriangleIcon
                    aria-hidden="true"
                    className="size-6 text-red-600"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-[var(--text-primary)]"
                  >
                    Delete chat?
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-[var(--text-secondary)]">
                      This will delete {selectedChatTitle}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    axiosInstance({
                      method: "delete",
                      url: `${API_URL}/api/agent/removeMessagesBySessionId`,
                      data: {
                        sessionId: currentSessionId,
                        userId: id,
                      },
                    })
                      .then((res) => {
                        const data = res.data
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        const yesterday = new Date(today)
                        yesterday.setDate(yesterday.getDate() - 1)

                        if (
                          data.status === "success" &&
                          Array.isArray(data.history)
                        ) {
                          const sortedConversations =
                            processChatHistoryByUserId(data)
                          savedData.saveMessageHistoryByUserId(
                            sortedConversations
                          )
                        }
                      })
                      .catch((err) => {
                        console.log(err)
                      })
                      .finally(() => {
                        setShowDeleteModal(false)
                      })
                  }}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto cursor-pointer"
                >
                  Delete
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-blue-500 hover:bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs sm:mt-0 sm:w-auto cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
