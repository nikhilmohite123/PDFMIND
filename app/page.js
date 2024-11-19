"use client"

import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api';
import { UserButton, useUser } from '@clerk/nextjs'
import { useMutation } from 'convex/react';
import React, { useEffect } from 'react'

export default function page() {
  const {user}=useUser();
  const createUser=useMutation(api.user.createUser)
 
  useEffect(()=>{
    user && CheckUser();
  },[user])


  const CheckUser=async()=>{
       const result=await createUser({
        email:user?.primaryEmailAddress?.emailAddress,
        imageUrl:user?.imageUrl,
        userName:user?.fullName

       })
       console.log(result)
  }
  return (
   <>
    <div>hello nikhil</div>
    <Button>Nikhil click</Button>
    <UserButton/>
   </>
  )
}
