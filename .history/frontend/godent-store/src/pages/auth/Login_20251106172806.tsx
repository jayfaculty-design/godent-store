import React from 'react'
import { ToastContainer } from 'react-toastify'

const Login = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <ToastContainer autoClose={1000} />
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <RiGalleryView className="size-4" />
          </div>
          GodEnt Store inc.
        </a>
    </div>
  )
}

export default Login
