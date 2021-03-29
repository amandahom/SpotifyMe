import React from 'react'

function Footer() {
  return (
    <div className="flex justify-center items-center h-16 bg-black text-white bottom-0 fixed w-full p-6">
      <p>
        Made by{' '}
        <a href="https://github.com/amandahom" className="hover:text-red-500">
          Amanda Hom
        </a>
      </p>
    </div>
  )
}

export default Footer
