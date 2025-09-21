"use client";

import { RootState } from "@/store/store";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { TbUpload } from "react-icons/tb";
import { FiPlus } from "react-icons/fi";
import { SiGoogledocs } from "react-icons/si";
import UploadModal from "./UploadModal";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const messages = [
    { from: "support", text: "Hi, how can I help you today?" },
    { from: "user", text: "Hey, I'm having trouble with my account." },
    { from: "support", text: "What seems to be the problem?" },
    { from: "user", text: "I can't log in." },
  ];

  // const source = [
  //   {key: 1, value: "one"},
  //   {key: 2, value: "two"},
  //   {key: 3, value: "three"},
  //   {key: 4, value: "four"},
  // ]

  const { data: session } = useSession();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const [showSourcePanel, setShowSourcePanel] = useState<boolean>(true);
  const [hasSource, setHasSource] = useState<object []>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();

  console.log("IsAuthenticated inside Dashboard:", isAuthenticated, "And user is:", user);
   useEffect(() => {
    // Only run this code on the client side
    if (!isAuthenticated && !user) {
      router.replace("/");
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="mt-10">
      {isAuthenticated && (
        <div className="flex w-full mx-auto justify-evenly">
          {/* Sources Panel */}
          <Card
            className={`${
              showSourcePanel ? "w-[30%]" : "w-[6%]"
            } h-[600px] flex flex-col border border-gray-600 rounded-2xl bg-[#52535432] transition-all duration-300 ease-in-out overflow-hidden`}
          >
            {/* Header */}
            <div className="flex items-center p-4 border-b border-gray-700">
              <div
                className={`w-full flex items-center ${
                  showSourcePanel ? "justify-between" : "justify-center"
                }`}
              >
                {showSourcePanel && (
                  <p className="transition-opacity duration-300">Sources</p>
                )}
                <i
                  className="cursor-pointer"
                  onClick={() => setShowSourcePanel(!showSourcePanel)}
                >
                  {/* Flip the icon when collapsed */}
                  <TbLayoutSidebarLeftCollapse
                    size={25}
                    className={`${
                      !showSourcePanel ? "rotate-180" : ""
                    } transition-transform duration-300`}
                  />
                </i>
              </div>
            </div>

            {showSourcePanel ? (
              <div className="flex flex-col h-full">
                {/* Add Button stays at the top */}
                <div 
                  className="flex gap-1 py-2 w-1/3 mx-auto items-center justify-center text-center bg-transparent border border-gray-600 rounded-[10px] cursor-pointer"
                  onClick={()=>setIsModalOpen(true)}
                >
                  <i>
                    <FiPlus size={25} />
                  </i>
                  <p className="text-xl">Add source</p>
                </div>

                {/* Docs + text block centered in remaining space */}
                {hasSource.length > 0 ? (
                  <div>
                    Here are the source
                  </div>
                ) : (
                  <div className="flex flex-1 items-center justify-center">
                  <div className="flex flex-col items-center justify-center text-center gap-2 text-gray-300">
                    <i className="text-4xl mb-2">
                      <SiGoogledocs />
                    </i>
                    <p className="font-medium">
                      Saved sources will appear here
                    </p>
                    <p className="text-sm opacity-70">
                      Click Add source above to add PDFs, CSV, websites, text,
                      videos, or Youtube link.
                    </p>
                  </div>
                </div>
                )}
              </div>
            ) : (
              <div 
                className="flex gap-1 py-2 w-1/3 mx-auto items-center justify-center text-center bg-transparent cursor-pointer"
                onClick={()=>setIsModalOpen(true)}
              >
                <i>
                  <FiPlus size={25} />
                </i>
              </div>
            )}
          </Card>

          {/* Chat Panel */}
          <Card
            className={`${
              showSourcePanel ? "w-[60%]" : "w-[90%]"
            } h-[600px] flex flex-col border border-gray-600 rounded-2xl bg-[#52535432] transition-all duration-300 ease-in-out`}
          >
            {/* Header */}
            <div className="flex items-center p-4 border-b border-gray-700">
              <div>
                <p>Chat</p>
              </div>
            </div>

            {hasSource.length > 0 ? (
              <ScrollArea className="flex-1 p-4 space-y-4 overflow-y-auto">
                <div className="flex flex-col gap-2">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`max-w-[75%] px-4 py-2 text-sm w-fit rounded-2xl ${
                        msg.from === "support"
                          ? "bg-[#4c505639] text-left self-start rounded-bl-none"
                          : "bg-white text-black text-left self-end rounded-br-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ): (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <i 
                  className="cursor-pointer"
                  onClick={()=>setIsModalOpen(true)}
                >
                  <TbUpload
                    size={40}
                    className="text-[rgba(66,89,255,1)] rounded-full"
                  />
                </i>
                <p className="text-lg font-medium">
                  Add a source to get started
                </p>
                <p 
                  className="px-4 py-2 border border-gray-500 rounded-[10px] cursor-pointer hover:bg-gray-700 transition"
                  onClick={()=>setIsModalOpen(true)}
                >
                  Upload a source
                </p>
              </div>
            )}
            {/* Input */}
            <form className="relative flex items-center gap-2 p-4">
              <Input
                placeholder="Type your message..."
                className="border-gray-500 bg-[#4c505639] rounded-[10px] dark:border-gray-800 placeholder:opacity-50 dark:focus:border-blue-400 focus:border-black h-14 text-2xl"
                disabled={hasSource.length === 0}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-6 text-muted-foreground hover:text-primary p-0 h-auto bg-transparent shadow-none cursor-pointer"
                disabled={hasSource.length === 0}
              >
                <PaperPlaneIcon className="h-5 w-5 cursor-pointer" />
              </Button>
            </form>
          </Card>
        </div>
      )}
      {isModalOpen && <UploadModal setIsModal={setIsModalOpen}/>}
    </div>
  );
};

export default Dashboard;
