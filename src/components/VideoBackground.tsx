/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import partyBgImage from '../assets/images/party_club_bg_1788354783297.jpg';
import partyBgWebm from '../assets/videos/party_bg.webm';
import partyBgMp4 from '../assets/videos/party_bg.mp4';

interface VideoBackgroundProps {
  className?: string;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({ className = '' }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoSrc, setVideoSrc] = useState<string>(partyBgWebm);
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force strict iOS Safari inline autoplay attributes
    video.muted = true;
    (video as any).defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('muted', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');

    const attemptPlay = () => {
      if (!video) return;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsVideoReady(true);
          })
          .catch(() => {
            // Handled on first user touch
          });
      }
    };

    attemptPlay();

    // Fallback: trigger playback on very first touch/tap on the document
    const handleFirstUserTouch = () => {
      attemptPlay();
      window.removeEventListener('touchstart', handleFirstUserTouch);
      window.removeEventListener('pointerdown', handleFirstUserTouch);
    };

    window.addEventListener('touchstart', handleFirstUserTouch, { passive: true, once: true });
    window.addEventListener('pointerdown', handleFirstUserTouch, { passive: true, once: true });

    return () => {
      window.removeEventListener('touchstart', handleFirstUserTouch);
      window.removeEventListener('pointerdown', handleFirstUserTouch);
    };
  }, [videoSrc]);

  const handleVideoError = () => {
    // If WebM format fails on strict iOS WebKit build, switch directly to MP4
    if (videoSrc !== partyBgMp4) {
      setVideoSrc(partyBgMp4);
    }
  };

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[#070414] ${className}`}>
      {/* 1. High-Res Nightclub Video */}
      <video
        ref={videoRef}
        key={videoSrc}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        onLoadedData={() => setIsVideoReady(true)}
        onCanPlay={() => setIsVideoReady(true)}
        onError={handleVideoError}
        poster={partyBgImage}
        className="w-full h-full object-cover object-center pointer-events-none relative z-10"
        style={{
          filter: 'contrast(1.08) brightness(0.95) saturate(1.1)',
        }}
        aria-hidden="true"
      />

      {/* 2. Soft Edge Vignette for High Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/75 pointer-events-none z-20" />
    </div>
  );
};
