"use client";

import { motion, useAnimation, PanInfo } from "framer-motion";
import { useState } from "react";

type WordCardProps = {
  from: string;
  to: string;
  index: number;
};

const pastelColors = [
  { border: "border-pink-400", text: "text-pink-400" },
  { border: "border-purple-400", text: "text-purple-400" },
  { border: "border-blue-300", text: "text-blue-300" },
  { border: "border-green-400", text: "text-green-400" },
  { border: "border-yellow-400", text: "text-yellow-400" },
  { border: "border-orange-400", text: "text-orange-400" },
];

function getHash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export default function WordCard({ from, to, index }: WordCardProps) {
  const controls = useAnimation();
  const hash = getHash(from + to);
  const colorIndex = (hash + index) % pastelColors.length;
  const color = pastelColors[colorIndex];

  const dragThreshold = -50;
  const openPosition = -108;

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (info.offset.x < dragThreshold || info.velocity.x < -500) {
      controls.start({
        x: openPosition,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      });
    } else {
      controls.start({
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      });
    }
  };

  const closeCard = () => {
    controls.start({ x: 0 });
  };

  return (
    <div className="px-4 relative mb-4">
      <div className="absolute inset-y-0 right-4 flex items-center space-x-2 z-0">
        <div className="flex flex-col items-center space-y-1">
          <button
            onClick={closeCard}
            className="w-11 h-11 cursor-pointer bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
          >
            <i className="ri-pencil-fill text-lg" />
          </button>
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
            Edit
          </span>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <button
            onClick={closeCard}
            className="w-11 h-11 cursor-pointer bg-red-400 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
          >
            <i className="ri-delete-bin-fill text-lg" />
          </button>
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
            Hapus
          </span>
        </div>
      </div>

      <motion.div
        drag="x"
        animate={controls}
        dragConstraints={{ left: openPosition, right: 0 }}
        dragElastic={0.03}
        onDragEnd={handleDragEnd}
        className="bg-white rounded-xl shadow-md p-2 relative z-10 cursor-grab active:cursor-grabbing"
      >
        <div
          className={`border-2 ${color.border} rounded-lg border-dashed px-4 py-3`}
        >
          <div className={`flex items-center space-x-4 ${color.text}`}>
            <p className="font-medium text-2xl">{from}</p>
            <i className="ri-arrow-right-long-line text-2xl" />
            <p className="font-medium text-2xl">{to}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
