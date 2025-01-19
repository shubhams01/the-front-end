import React, { Suspense } from 'react'
import Confirmation from '../components/User/Confirmation'

const page = () => {
  return (
    <Suspense><Confirmation /></Suspense>
  )
}

export default page