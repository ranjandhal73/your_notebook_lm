import React, { useState } from 'react'
import { MdOutlineInsertLink } from "react-icons/md";
import { CgWebsite } from "react-icons/cg";
import { FaYoutube } from "react-icons/fa";
import LinkModal from './LinkModal';

interface LinkComponentProps {
    setIsModal: React.Dispatch<React.SetStateAction<boolean>>
}

const LinkComponent:React.FC<LinkComponentProps> = ({setIsModal}) => {
    const [isLinkModalOpen, setIsLinkModalOpen] = useState<boolean>(false);
    const [linkType, setLinkType] = useState<"website" | "youtube">("website");
  return (
    <div className='w-full flex gap-10'>
        <div className="w-full border-[1px] border-gray-600 rounded-[10px] h-[18vh] px-6 py-2 flex flex-col gap-6">
            <div 
                className='flex items-center gap-2 text-gray-400 cursor-pointer'
                onClick={()=>{
                    setLinkType("website")
                    setIsLinkModalOpen(true)
                }}
            >
                <i>
                    <MdOutlineInsertLink size={25}/>
                </i>
                <p className='text-lg'>Link</p>
            </div>
            <div className='flex items-center gap-4 text-gray-400'>
                <div 
                    className='flex items-center gap-2 px-6 py-1 bg-[#303039] rounded-[8px] cursor-pointer'
                    onClick={()=>{
                        setLinkType("website")
                        setIsLinkModalOpen(true)
                    }}
                >
                    <i><CgWebsite size={25}/></i>
                    <p>Website</p>
                </div>
                <div 
                    className='flex items-center gap-2 px-6 py-1 bg-[#303039] rounded-[8px] cursor-pointer'
                    onClick={()=>{
                        setLinkType("youtube")
                        setIsLinkModalOpen(true)
                    }}
                >
                    <i><FaYoutube size={25}/></i>
                    <p>Youtube</p>
                </div>
            </div>
        </div>
        <div className="w-full border-[1px] border-gray-600 rounded-[10px] h-[18vh] text-gray-400 flex items-center justify-center">
            <div className='px-4 text-center'>
                 Big things are coming — new feature dropping soon!🔥
            </div>
        </div>
        {isLinkModalOpen && (<LinkModal setIsLinkModalOpen={setIsLinkModalOpen} linkType={linkType} setIsModal={setIsModal}/>)}
    </div>
  )
}

export default LinkComponent