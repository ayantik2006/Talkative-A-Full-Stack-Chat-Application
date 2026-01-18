import BackArrow from '@/components/BackArrow'
import React from 'react'
import PendingRequestList from './PendingRequestList'

function Requests() {
  return (
    <div className="min-h-screen text-white bg-neutral-800 flex flex-col gap-7 p-10">
      <div className="flex gap-5">
        <BackArrow/>
        <h1 className="text-2xl font-semibold">Pending Friend Requests</h1>
      </div>
      <div className="">
        <PendingRequestList/>
      </div>
    </div>
  )
}

export default Requests