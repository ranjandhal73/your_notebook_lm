"use client";

import React, { useEffect } from 'react'
import VerifyEmailForm from '@/components/VerifyUserEmail';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';


const Page = () => {
  const router = useRouter();
  const {isAuthenticated} = useSelector((state: RootState) =>  state.auth);

  console.log("isAuthenticated", isAuthenticated)

  useEffect(()=>{
    if(isAuthenticated){
        router.replace('/');
      }
  },[isAuthenticated, router])
  return (
    <div>
        {!isAuthenticated && <VerifyEmailForm />}
    </div>
  )
}

export default Page;