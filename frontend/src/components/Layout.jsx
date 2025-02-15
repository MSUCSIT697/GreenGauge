'use client'

import Navbar from './Navbar' // Ensure this matches your file structure

export default function Layout({ children }) {
  return (
    <div>
      <Navbar /> {/* Ensure you're using the correct Navbar component */}
      <main>{children}</main> {/* Ensure children is correctly passed */}
    </div>
  )
}
