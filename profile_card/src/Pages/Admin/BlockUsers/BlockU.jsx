import React from 'react'

const BlockU = () => {

  return (
    <div className='flex justify-center items-start min-h-screen p-6'>
        <div className='overflow-x-auto'>
            <table className='w-[600px] border border-gray-300 shadow-md rounded-md'>
                <thead className='bg-red-500 text-white'>
                    <tr>
                        <th className='px-4 py-2 text-left border-b border-gray-300'>S.No.</th>
                        <th className='px-4 py-2 text-left border-b border-gray-300'>Name</th>
                        <th className='px-4 py-2 text-left border-b border-gray-300'>Cause</th>
                        <th className='px-4 py-2 text-left border-b border-gray-300'>Block</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='hover:bg-slate-600'>
                        <td className='px-4 py-2 border-b border-gray-200'></td>
                        <td className='px-4 py-2 border-b border-gray-200'></td>
                        <td className='px-4 py-2 border-b border-gray-200'></td>
                        <td className='px-4 py-2 border-b border-gray-200'></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  )
}


export default BlockU