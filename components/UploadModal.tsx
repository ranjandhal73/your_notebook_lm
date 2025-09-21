"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import DragAndDrop from "./DragAndDrop";
import LinkComponent from "./LinkComponent";
import axios from "axios";

interface UploadModalProps {
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadModal: React.FC<UploadModalProps> = ({ setIsModal }) => {
  const [visible, setVisible] = useState<boolean>(false);

  // Trigger entrance animation on mount
  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      setIsModal(false); // Unmount after animation
    }, 300);
  };

  const handleFileSelect = async (file: File | null) => {
    console.log(file);
    if(file){
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "file");
      try {
        const result = await axios.post(
          "/api/add-source",
          formData,
          {
            withCredentials: true,
            headers:{
              "Content-Type": "multipart/form-data"
            },
          }
        )
        console.log("Results of file:", result);
      } catch (error) {
        console.log("Error:", error);
      }
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`bg-[#1d2029] max-w-5xl w-full rounded-[10px] shadow-lg h-full max-h-[80vh] overflow-auto relative transform transition-all duration-300 ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Heading */}
        <div className="py-2 px-8 flex items-center justify-between sticky top-0 bg-[#1d2029] z-20">
          <div>
            <Image
              src="/icons/logo2.svg"
              alt="Application Logo"
              width={200}
              height={200}
            />
          </div>
          <button
            onClick={handleClose}
            className="cursor-pointer p-1 rounded hover:bg-[#2c2f3a] transition-colors"
            aria-label="Close modal"
          >
            <IoClose size={40} className="text-[#5ab5a2]" />
          </button>
        </div>

        {/* Description */}
        <div className="p-8 z-10">
          <DragAndDrop
            onFileSelect={handleFileSelect}
            acceptTypes={["PDF", "CSV", "JPG"]}
          />
        </div>
        <div className="p-8 z-10">
            <LinkComponent setIsModal={setIsModal}/>
          </div>
      </div>
    </div>
  );
};

export default UploadModal;
