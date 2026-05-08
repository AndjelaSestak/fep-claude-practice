import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import router from './router/index'

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer newestOnTop />
    </>
  )
}

export default App
