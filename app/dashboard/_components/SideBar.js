'use client'
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Layout, Shield } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import UploadPdf from './UploadPdf'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

function SideBar() {

    const { user } = useUser();
    const path=usePathname();
    const fileList = useQuery(api.fileStorage.getUserFile, {
      userEmail: user?.primaryEmailAddress?.emailAddress
    });
    return (
        <div className='shadow-sm h-screen p-2'>
            <Image src={'/logo1.svg'} alt="logo" width={180} height={120} />

            <div className=' mt-10'>
                
                <UploadPdf isMaxFile={fileList?.length>=5 ?true:false}>
                <Button className="w-full">+ Upload PDF</Button>
                </UploadPdf>
              <Link href={'/dashboard'}>
              <div className={`flex gap-2 items-center p-3 mt-5 hover:bg-slate-100 ${path=='/dashboard'&& 'bg-slate-200'} rounded-lg cursor-pointer`}>
                    <Layout />
                    <h2>Workspace</h2>
                </div>
              </Link>


      <Link href={'/dashboard/upgrade'}>
      <div className={`flex gap-2 items-center p-3 mt-1 hover:bg-slate-100  rounded-lg cursor-pointer ${path==='/dashboard/upgrade'? 'bg-slate-200' :null}` }>
                    <Shield />
                    <h2>Upgrade</h2>
                </div>
      </Link>

            </div>
            <div className=' absolute bottom-10 w-[80%]'>
                <Progress value={fileList?.length/5*100} />
                <p className='text-sm mt-2'>{fileList?.length}out of 5 Pdf Uploaded</p>
                <p className='text-sm text-gray-400 mt-2'>Upgrade to Upload more PDF</p>
            </div>
        </div>
    )
}

export default SideBar