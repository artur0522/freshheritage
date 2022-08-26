import React from 'react'
import Link from 'next/link';

const test = () => {
  return (


    <div>test
      <Link href="/">home</Link>
      <button
        type="button"
        onClick={() => {
          throw new Error("Sentry Frontend Error");
        }}
      >
        Throw error
      </button>

    </div>



  )
}

export default test;