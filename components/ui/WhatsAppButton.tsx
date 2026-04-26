'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { getWhatsAppUrl } from '@/lib/whatsapp'
import { WHATSAPP_MESSAGES } from '@/lib/config'

export default function WhatsAppButton() {
  const url = getWhatsAppUrl(WHATSAPP_MESSAGES.general)

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 260, damping: 20 }}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
    >
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.5 }}
        className="hidden md:block bg-white text-slate-700 text-sm font-medium px-3 py-2 rounded-xl shadow-card border border-slate-100 whitespace-nowrap"
      >
        Need help? Chat with us
      </motion.div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="whatsapp-pulse flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform duration-200 hover:scale-110"
        style={{ backgroundColor: '#25D366' }}
      >
        <MessageCircle className="w-7 h-7 text-white fill-white" />
      </a>
    </motion.div>
  )
}
