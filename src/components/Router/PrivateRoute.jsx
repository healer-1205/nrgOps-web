import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import axiosInstance from "../../utils/axios"

export const PrivateRoute = ({ children }) => {
  try {
    const token = localStorage.getItem("accessToken")
    let isLoggedIn = false
    if (token) {
      const payload = jwtDecode(token)
      if (payload.exp > Date.now() / 1000) {
        isLoggedIn = true
      }
    }
    if (isLoggedIn) {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`
      return children
    } else {
      return <Navigate to="/signin" />
    }
  } catch (error) {
    console.log(error)
    return <Navigate to="/signin" />
  }
}

export const NonPrivateRoute = ({ children }) => {
  try {
    const token = localStorage.getItem("accessToken")
    let isLoggedIn = false
    if (token) {
      const payload = jwtDecode(token)
      if (payload.exp > Date.now() / 1000) {
        isLoggedIn = true
      }
    }
    if (isLoggedIn) {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`
      return <Navigate to="/dashboard" />
    } else {
      return children
    }
  } catch (error) {
    console.log(error)
    return children
  }
}
