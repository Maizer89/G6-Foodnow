import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './css/index.css'
import App from './App.jsx'
import routes from './routes.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: routes.map(({ path, element }) => ({
      path: path === '/' ? undefined : path,
      index: path === '/',
      element,
    })),
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
