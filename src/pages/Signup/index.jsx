import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../../utils/constants"

export const Signup = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [msg, setMsg] = useState("")
  const [isError, setIsError] = useState(false)

  const Signup = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_URL}/api/users`, {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      })
      navigate("/signin")
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg)
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
              Register your account
            </h2>
            <p className="text-center text-red-600 font-semibold pt-5">{msg}</p>
          </div>
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-black">
            <form className="space-y-6" onSubmit={Signup}>
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
                    required
                    className={
                      "block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm " +
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
                    required
                    className={
                      "block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm " +
                      (isError ? "border-red-500" : "")
                    }
                    onChange={(e) => {
                      setPassword(e.target.value)
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    className={
                      "block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm " +
                      (isError ? "border-red-500" : "")
                    }
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                    }}
                  />
                </div>
              </div>

              <div>
                <button className="flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer">
                  Register
                </button>
              </div>

              <p className="text-center">
                Already have an account?{" "}
                <span>
                  <Link to="/signin" className="text-blue-500">
                    Sign in
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
