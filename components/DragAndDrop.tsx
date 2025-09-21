import React, { useState } from 'react'
import { FileUploader } from 'react-drag-drop-files'

interface DragAndDropProps {
  onFileSelect: (file: File | null) => void
  acceptTypes?: string[]
  multiple?: boolean
}

const DragAndDrop: React.FC<DragAndDropProps> = ({
  onFileSelect,
  acceptTypes = ['PDF', 'CSV', 'JPG'],
  multiple = false
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTypeError = (errorFileType: string) => {
    setError(`Unsupported file type: ${errorFileType}`);
    setFile(null);
    onFileSelect(null);
  }

  const handleChange = (data: File | File[] | null) => {
    setError(null);

    if (!data) {
      setFile(null)
      onFileSelect(null)
      return
    }

    if (Array.isArray(data)) {
      setFile(data[0])
      onFileSelect(data[0])
    } else {
      setFile(data)
      onFileSelect(data)
    }

    console.log(`Data:`, data);
    console.log(`File:`, file)
  }

  return (
    <div className="w-full border-2 border-dashed border-gray-600 rounded-[10px] py-16">
      <FileUploader
        handleChange={handleChange}
        name="file"
        types={acceptTypes}
        multiple={multiple}
        classes={`${file ? 'pointer-events-none' : ''}`}
        onTypeError={handleTypeError}
        // classes="border-2 border-dashed border-gray-600 rounded-xl bg-[#1f1f1f] p-10 text-center transition-colors hover:border-gray-400"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="bg-[#2d2d2d] rounded-full p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12"
              />
            </svg>
          </div>
          <p className="text-white text-lg font-semibold">Upload sources</p>
          <p className="text-gray-400 text-sm">
            Drag & drop or{' '}
            <span className="text-blue-400 underline cursor-pointer">
              choose file
            </span>{' '}
            to upload
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Supported file types: PDF, CSV, JPG
          </p>
          {error && (
            <p className='text-red-4000 text-sm mt-2'>{error}</p>
          )}
          {file && (
            <p className="text-green-400 text-sm mt-2">
              Selected file: {file.name}
            </p>
          )}
        </div>
      </FileUploader>
    </div>
  )
}

export default DragAndDrop;
