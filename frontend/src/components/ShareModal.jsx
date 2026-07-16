import React, { useState } from "react";
import { Copy, Check, X, Mail, Send } from "lucide-react";
import { FaTwitter, FaFacebook, FaWhatsapp } from "react-icons/fa";

export default function ShareModal({ isOpen, onClose, url, title = "Check this out!" }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: <FaWhatsapp className="w-5 h-5" />,
      color: "bg-green-500 hover:bg-green-600",
      action: () =>
        window.open(
          `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
          "_blank"
        ),
    },
    {
      name: "X (Twitter)",
      icon: <FaTwitter className="w-5 h-5" />,
      color: "bg-black hover:bg-gray-800",
      action: () =>
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
          "_blank"
        ),
    },
    {
      name: "Facebook",
      icon: <FaFacebook className="w-5 h-5" />,
      color: "bg-blue-600 hover:bg-blue-700",
      action: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank"
        ),
    },
    {
      name: "Email",
      icon: <Mail className="w-5 h-5" />,
      color: "bg-gray-600 hover:bg-gray-700",
      action: () =>
        window.open(
          `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
          "_self"
        ),
    },
    {
        name: "Share",
        icon: <Send className="w-5 h-5" />,
        color: "bg-indigo-500 hover:bg-indigo-600",
        action: nativeShare,
      }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-sm overflow-hidden bg-white shadow-2xl rounded-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Share this link</h2>
          <button 
            onClick={onClose}
            className="p-1 transition-colors rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Social Grid */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                onClick={option.action}
                className="flex flex-col items-center gap-2 group"
              >
                <div className={`flex items-center justify-center w-12 h-12 text-white transition-transform rounded-full shadow-md ${option.color} group-hover:scale-110`}>
                  {option.icon}
                </div>
                <span className="text-xs font-medium text-gray-600">{option.name}</span>
              </button>
            ))}
          </div>

          {/* Copy Link Section */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Page Link</p>
            <div className="flex items-center p-2 border rounded-lg bg-gray-50">
              <input 
                readOnly 
                value={url} 
                className="flex-1 px-2 text-sm text-gray-600 bg-transparent outline-none truncate"
              />
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-4 py-2 ml-2 text-sm font-bold text-white transition-all rounded-md shadow-sm ${
                  copied ? "bg-green-500" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}