import { createBrowserRouter } from "react-router"
import Login from "./features/auth/pages/Login.jsx"
import Register from "./features/auth/pages/Register.jsx"
import Feed from "./features/posts/pages/Feed.jsx"
import CreatePost from "./features/posts/pages/CreatePost.jsx"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Feed />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/create-post",
    element: <CreatePost />
  }
])