import React, { useState } from "react";
import { Input } from "./ui/input";
import { IoClose } from "react-icons/io5";
import { Button } from "./ui/button";
import axios from "axios";

interface LinkModalProps {
  setIsLinkModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  linkType: "website" | "youtube";
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const LinkModal: React.FC<LinkModalProps> = ({
  setIsLinkModalOpen,
  linkType,
  setIsModal,
}) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const trimmedUrl = url.trim();
    const urls = trimmedUrl.split(/\s+/);

    if (urls.length > 1) {
      return setError("Only one link can be submitted at a time.");
    }

    const isValidUrl = /^https?:\/\/\S+\.\S+$/i.test(urls[0]);
    if (!isValidUrl) {
      return setError("Please enter a valid URL starting with http:// or https://");
    }

    setError("");

    try {
      await axios.post(
        "/api/add-source",
        JSON.stringify({ data: urls[0], type: linkType }),
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setIsLinkModalOpen(false);
      setIsModal(false);
    } catch (err) {
      setError("Failed to submit the link. Please try again.");
    }
  };

  const heading = linkType === "website" ? "Website URLs" : "YouTube URL";
  const placeholder = `Paste ${linkType === "website" ? "Website" : "YouTube"} URL here...`;
  const note =
    linkType === "website"
      ? "You can paste any public website link. Keep it to just one URL — clean and simple."
      : "Make sure it's a public YouTube video. Transcripts will be pulled automatically. One link only, please.";

  return (
    <div
      className="fixed inset-0 w-full z-60 flex items-center justify-center bg-black/95 transition-opacity"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#475353e9] max-w-3xl w-full rounded-[10px] shadow-lg h-full max-h-[60vh] overflow-auto relative transform transition-all p-6">
        <div className="text-right">
          <Button
            onClick={() => setIsLinkModalOpen(false)}
            className="cursor-pointer rounded hover:bg-red-800 hover:text-white"
            aria-label="Close modal"
          >
            <IoClose className="text-[#5ab5a2] hover:text-white" size={40} />
          </Button>
        </div>

        <h2 className="text-2xl text-white font-semibold mb-1">{heading}</h2>
        <p className="text-gray-300">Paste your {linkType} link below to continue.</p>

        <div className="mt-4">
          <Input
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError("");
            }}
            className="border border-gray-500 bg-[#1a29288f] rounded-[10px] placeholder:opacity-50 focus:border-blue-500 h-16 text-lg text-white px-4"
            type="text"
            placeholder={placeholder}
          />
          {error ? (
            <p className="text-red-950 mt-2 text-sm">{error}</p>
          ) : (
            <p className="text-sm text-gray-300 mt-2">{note}</p>
          )}
        </div>

        <div className="text-right mt-6">
          <Button
            className="border px-6 py-2 rounded-2xl border-gray-500 hover:bg-[#2c2f3a] transition-colors"
            disabled={!url.trim()}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LinkModal;
