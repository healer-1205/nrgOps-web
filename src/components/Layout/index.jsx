import { useState, useEffect } from "react"
import { useLocation, NavLink } from "react-router"
import { Link } from "react-router-dom"
import { useTheme } from "../../context/ThemeContext"
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
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
} from "@heroicons/react/24/outline"
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid"
import assets from "../../assets"

const userNavigation = [
  { name: "Your profile", href: "/" },
  { name: "Sign out", href: "/" },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [navigation, setNavigation] = useState([])
  const location = useLocation()
  const { isDarkMode, toggleTheme } = useTheme()

  useEffect(() => {
    setNavigation([
      { name: "Dashboard", href: "/", icon: HomeIcon, current: true },
      { name: "Agent", href: "/agent", icon: UserGroupIcon, current: false },
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

  return (
    <>
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
                    <XMarkIcon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
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
              <p className="text-3xl text-white" style={{ color: 'white !important' }}>NrgOps</p>
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
                              style={{ color: 'white !important' }}
                            >
                              {item.icon && (
                                <item.icon
                                  className="h-6 w-6 shrink-0 text-gray-300"
                                  aria-hidden="true"
                                  style={{ color: 'white !important' }}
                                />
                              )}
                              <div style={{ color: 'white !important'}}>{item.name}</div>
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
                              style={{ color: 'white !important' }}
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
                                    style={{ color: 'white !important' }}
                                  >
                                    <item.icon
                                      className="h-6 w-6 shrink-0 text-gray-300"
                                      aria-hidden="true"
                                      style={{ color: 'white !important' }}
                                    />
                                    <div style={{ color: 'white !important' }}>{item.name}</div>
                                    <ChevronRightIcon
                                      className={classNames(
                                        open
                                          ? "rotate-90 text-white"
                                          : "text-white",
                                        "ml-auto h-5 w-5 shrink-0"
                                      )}
                                      aria-hidden="true"
                                      style={{ color: 'white !important' }}
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
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--header-bg)', borderColor: 'var(--border-color)' }}>
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
                  className="col-start-1 row-start-1 block size-full pl-8 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm/6"
                  
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
                  style={{ backgroundColor: isDarkMode ? '#374151' : '#e5e7eb' }}
                >
                  <span className="sr-only">Toggle theme</span>
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isDarkMode ? 'translate-x-5' : 'translate-x-0'
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
                        Healer
                      </span>
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="ml-2 size-5 text-gray-400"
                      />
                    </span>
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 ring-1 shadow-lg ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        <Link
                          to={item.href}
                          className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                        >
                          {item.name}
                        </Link>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          <main className="py-10 min-h-[calc(100vh-64px)]" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="px-4 sm:px-6 lg:px-8" style={{ color: 'var(--text-primary)' }}>{children}</div>
          </main>
        </div>
      </div>
    </>
  )
}
