"use client";

import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <motion.div
      className="w-8 h-8 border-4 border-t-transparent border-primary rounded-full"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1 }}
    />
  );
}
