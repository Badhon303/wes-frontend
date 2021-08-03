import React from 'react'

function Chart({ children, title }) {
  return (
    <div className="min-w-0 p-6 bg-white rounded-lg shadow-xs dark:bg-gray-800">
      <p className="mb-4 text-title text-base  md:text-2xl font-medium font-gibson text-left">{title}</p>
      {children}
    </div>
  )
}

export default Chart
