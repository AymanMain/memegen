"use client";

import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Twitter, Facebook, Link as LinkIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  memeUrl: string;
  memeTitle: string;
}

export default function ShareDialog({ isOpen, onClose, memeUrl, memeTitle }: ShareDialogProps) {
  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${memeUrl}` : memeUrl;

  const handleShare = async (platform: 'twitter' | 'facebook') => {
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(memeTitle)}&url=${encodeURIComponent(fullUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    onClose();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success('Link copied to clipboard!');
      onClose();
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error('Failed to copy link');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="div"
                  className="flex items-center justify-between mb-4"
                >
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Share Meme
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </Dialog.Title>

                <div className="mt-4 space-y-4">
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                    <span>Share on Twitter</span>
                  </button>

                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Facebook className="h-5 w-5 text-[#4267B2]" />
                    <span>Share on Facebook</span>
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LinkIcon className="h-5 w-5" />
                    <span>Copy Link</span>
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 