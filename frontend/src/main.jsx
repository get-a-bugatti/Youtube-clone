import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { Provider } from 'react-redux'
import router from "./router/router.jsx"
import store from "./store/store.js"



createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router}></RouterProvider>
  </Provider>
)
