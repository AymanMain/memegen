"use client";

import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon
} from 'react-share';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  memeUrl: string;
  memeTitle?: string;
}

const ShareDialog: React.FC<ShareDialogProps> = ({
  isOpen,
  onClose,
  memeUrl,
  memeTitle = "Check out this meme!"
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(memeUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.origin + memeUrl : memeUrl;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-xl">
          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Share your meme
          </Dialog.Title>

          <div className="space-y-4">
            {/* Social Share Buttons */}
            <div className="flex justify-center space-x-4">
              <FacebookShareButton url={shareUrl} quote={memeTitle}>
                <FacebookIcon size={40} round />
              </FacebookShareButton>

              <TwitterShareButton url={shareUrl} title={memeTitle}>
                <TwitterIcon size={40} round />
              </TwitterShareButton>

              <WhatsappShareButton url={shareUrl} title={memeTitle}>
                <WhatsappIcon size={40} round />
              </WhatsappShareButton>
            </div>

            {/* Direct Link */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Direct Link
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-2 rounded-r-md text-white transition-colors ${
                    copied ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Download QR Code */}
            <div className="mt-4 text-center">
              <button
                onClick={() => window.open(memeUrl, '_blank')}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                Download meme
              </button>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ShareDialog; 