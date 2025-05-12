'use client';

import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import Image from 'next/image';
import { VideoContent } from '@/types/interfaces/VideoContent';

type VideoSelectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (video: VideoContent) => void;
};

export default function VideoSelectModal({
  isOpen,
  onClose,
  onSelect,
}: VideoSelectModalProps) {
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchVideos = async () => {
      setLoading(true);
      const res = await fetch('/api/videos');
      const data = await res.json();
      console.log('video data ', data);
      setVideos(data || []);
      setLoading(false);
    };

    fetchVideos();
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white max-w-xl w-full rounded-lg shadow-lg p-6 space-y-4 overflow-y-auto max-h-[80vh]">
          <Dialog.Title className="text-xl font-bold">
            Select Video for Challenge
          </Dialog.Title>

          {loading && <p className="text-gray-500">Loading videos...</p>}

          {!loading && videos.length === 0 && (
            <p className="text-gray-500">No videos available.</p>
          )}

          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {videos.map((video) => (
                <button
                  key={video.id}
                  className="flex flex-col items-center border rounded-lg p-3 hover:bg-pink-50 transition"
                  onClick={() => {
                    onSelect(video);
                    onClose();
                  }}
                >
                  {video.thumbnail_url ? (
                    <Image
                      src={video.thumbnail_url}
                      alt={video.title}
                      width={90}
                      height={160}
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-full h-[90px] bg-gray-100 flex items-center justify-center text-gray-400 rounded-md">
                      No Thumbnail
                    </div>
                  )}
                  <p className="text-sm mt-2 font-medium text-center">
                    {video.title}
                  </p>
                </button>
              ))}
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
