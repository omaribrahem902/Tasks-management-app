import{ type ReactNode } from 'react'

const AuthLayout = ({ children } : { children: ReactNode }) => {
  return (
    <section className="flex justify-center items-center min-h-screen surface-low">
      {children}
     </section>
  )
}

export default AuthLayout