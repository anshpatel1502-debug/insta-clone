import React from 'react'
import { router } from './App.routes'
import { RouterProvider } from 'react-router'
import "./features/shared/globel.scss"
import { AuthProvider } from './features/auth/auth.context.jsx'
import { PostContextProvider } from './features/posts/Post.context.jsx'

const App = () => {
  return (
    <AuthProvider>
      <PostContextProvider>
        <RouterProvider router={router} />
      </PostContextProvider>
    </AuthProvider>
  )
}

export default App