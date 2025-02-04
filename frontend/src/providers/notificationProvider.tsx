import { toast, ToastContainer } from 'react-toastify'
import React from 'react'
type NotificationContextType = {
  showNotification: (
    msg: string,
    type: 'success' | 'info' | 'warning' | 'error'
  ) => void
}
export const NotificationContext =
  React.createContext<NotificationContextType | null>(null)

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const showNotification = (
    msg: string,
    type: 'success' | 'info' | 'warning' | 'error'
  ) => {
    toast[type](msg, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'dark',
    })
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      <ToastContainer
        position="top-right"
        autoClose={50000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationProvider
