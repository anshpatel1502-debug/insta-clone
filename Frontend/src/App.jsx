import React, { useEffect } from 'react'
import { router } from './App.routes'
import { RouterProvider } from 'react-router'
import "./features/shared/globel.scss"
import { Provider, useDispatch } from 'react-redux'
import { store } from './store'
import { fetchCurrentUser } from './store/slices/authSlice'

const AppContent = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCurrentUser())
  }, [dispatch])

  return <RouterProvider router={router} />
}

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App