import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../../utils/constants"
import { useAuth } from "../../context/AuthContext"

export const Signin = () => {
  const navigate = useNavigate()
  const auth = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [msg, setMsg] = useState("")
  const [isError, setIsError] = useState(false)

  const Signin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API_URL}/api/users/login`, {
        email: email,
        password: password,
      })
      if (response.data.accessToken) {
        auth.saveAccount(response.data)
        navigate("/dashboard")
      }
    } catch (error) {
      if (error.response) {
        setMsg("These credentials do not match our records.")
        setIsError(true)
      }
    }
  }
  return (
    <>
      <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            <p className="text-center text-red-600 font-semibold pt-5">{msg}</p>
          </div>
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-black">
            <form className="space-y-6" onSubmit={Signin}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={
                      "block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm " +
                      (isError ? "border-red-500" : "")
                    }
                    onChange={(e) => {
                      setEmail(e.target.value)
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className={
                      "block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm " +
                      (isError ? "border-red-500" : "")
                    }
                    onChange={(e) => {
                      setPassword(e.target.value)
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-indigo-500 hover:text-indigo-600"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div>
                <button className="flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer">
                  Sign in
                </button>
              </div>

              <p className="text-center">
                Not a member?{" "}
                <span>
                  <Link to="/signup" className="text-indigo-500">
                    Sign up
                  </Link>
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
