import { memo, useRef, useState } from "react"
import { PaperAirplaneIcon, PaperClipIcon } from "@heroicons/react/24/outline"
import { API_URL } from "../../utils/constants"
import axiosInstance from "../../utils/axios"

export const InputArea = memo(
  ({
    isStandalone = false,
    message,
    setMessage,
    handleSendMessage,
    isLoading,
    setUploadedFiles,
    uploadedFiles,
  }) => {
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef(null)
    const dragCounter = useRef(0)

    const handleFileUpload = async (files) => {
      if (!files || files.length === 0) return

      const userId = localStorage.getItem("id")

      const previews = Array.from(files).map((file) => ({
        fileName: file.name,
        fileId: null,
        isUploading: true,
      }))

      setUploadedFiles((prev) => [...prev, ...previews])

      const formData = new FormData()
      for (const file of files) {
        formData.append("files", file)
      }
      formData.append("userId", userId)

      try {
        setIsUploading(true)
        const response = await axiosInstance({
          method: "post",
          url: `${API_URL}/api/upload`,
          data: formData,
        })

        const data = response.data

        setUploadedFiles((prev) =>
          prev.map((prevFile) => {
            const match = data.find((f) => f.originalName === prevFile.fileName)
            return match
              ? { ...prevFile, fileId: match.id, isUploading: false }
              : prevFile
          })
        )
      } catch (error) {
        console.error("Error uploading files:", error)

        setUploadedFiles((prev) =>
          prev.filter(
            (prevFile) =>
              !Array.from(files).some((f) => f.name === prevFile.fileName)
          )
        )
      } finally {
        setIsUploading(false)
      }
    }

    const handleRemoveFile = (fileId) => {
      setUploadedFiles((prev) => prev.filter((f) => f.fileId !== fileId))
    }

    const handleDragOver = (e) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
    }

    const handleDragEnter = (e) => {
      e.preventDefault()
      e.stopPropagation()
      dragCounter.current++
      setIsDragging(true)
    }

    const handleDragLeave = (e) => {
      e.preventDefault()
      e.stopPropagation()
      dragCounter.current--
      if (dragCounter.current === 0) {
        setIsDragging(false)
      }
    }

    const handleDrop = (e) => {
      e.preventDefault()
      e.stopPropagation()
      dragCounter.current = 0
      setIsDragging(false)
      const files = e.dataTransfer.files
      handleFileUpload(files)
    }

    return (
      <div
        className={`${
          isStandalone
            ? "w-full max-w-5xl p-4 rounded-lg shadow-md"
            : "sticky bottom-0 w-full border-t border-[var(--border-color)] bg-[var(--bg-primary)] p-4"
        }`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={`${isStandalone ? "" : "max-w-5xl mx-auto"}`}>
          <div className="flex items-center gap-4">
            <div className="relative flex-grow">
              {uploadedFiles.length > 0 && (
                <div className="flex gap-2 mb-2 flex-wrap">
                  {uploadedFiles.map((file, index) => (
                    <span
                      className="inline-flex items-center gap-x-0.5 rounded-md bg-indigo-500 px-2 py-1 text-xs font-medium text-white ring-1 ring-indigo-700/10 ring-inset"
                      key={index}
                    >
                      {file.fileName}
                      {!file.isUploading && (
                        <button
                          type="button"
                          className="group relative -mr-1 size-3.5 rounded-md hover:bg-indigo-600/20 cursor-pointer"
                          onClick={() => handleRemoveFile(file.fileId)}
                        >
                          <span className="sr-only">Remove</span>
                          <svg
                            viewBox="0 0 14 14"
                            className="size-3.5 stroke-white group-hover:stroke-gray-300"
                          >
                            <path d="M4 4l6 6m0-6l-6 6" />
                          </svg>
                          <span className="absolute -inset-1" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              )}

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    if (isUploading || isLoading || !message.trim()) return
                    handleSendMessage(message).then(() => {
                      setUploadedFiles([])
                    })
                  }
                }}
                placeholder="Send a message to NrgOps"
                rows={2}
                className={`w-full px-4 py-3 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 border resize-none min-h-[44px] max-h-[200px] ${
                  isDragging
                    ? "border-indigo-500"
                    : "border-[var(--border-color)]"
                }`}
              />
              {isDragging && (
                <div className="absolute inset-0 bg-indigo-50 bg-opacity-50 border-2 border-dashed border-indigo-500 rounded-lg flex items-center justify-center">
                  <p className="text-indigo-500 font-medium">Drop files here</p>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
              multiple
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-md bg-indigo-600 hover:bg-indigo-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title={isUploading ? "Uploading..." : "Attach files"}
              disabled={isUploading}
            >
              {isUploading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent "></div>
              ) : (
                <PaperClipIcon
                  aria-hidden="true"
                  className="size-6 text-white"
                />
              )}
            </button>
            <button
              onClick={() => {
                if (isLoading || isUploading || !message.trim()) return
                handleSendMessage(message).then(() => {
                  setUploadedFiles([])
                })
              }}
              disabled={isLoading || isUploading || !message.trim()}
              className="p-2 rounded-md bg-indigo-600 hover:bg-indigo-500 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon
                aria-hidden="true"
                className="size-6 text-white"
              />
            </button>
          </div>
        </div>
      </div>
    )
  }
)
