import React from 'react';
import { Music4} from 'lucide-react';
import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa6";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#050508] text-white border-t border-gray-900/60 px-6 py-12 overflow-hidden">
      {/* Soft background ambient light spilling from the bottom corner */}
      <div className="absolute bottom-0 right-12 w-72 h-72 bg-purple-900/5 blur-[100px] pointer-events-none rounded-full" />
      
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center md:justify-between gap-8 pb-8 border-b border-gray-900/40 text-center md:text-left">
          
          {/* Brand Column */}
          <div className="flex flex-col items-center md:items-start gap-2 max-w-sm">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <Music4 className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-serif font-medium tracking-wide text-gray-100">
                The Benaras Beats
              </h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Building communities through music and culture. Nurturing divine traditions and local creators.
            </p>
          </div>

          {/* Social Links Media Column */}
          <div className="flex items-center gap-4">
            <a 
              href="#" 
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900/40 border border-gray-800/80 text-gray-400 hover:text-amber-400 hover:border-amber-500/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)] transition-all duration-300"
            >
              <FaInstagram className="w-4 h-4" />
            </a>
            <a 
              href="https://www.facebook.com/share/18cWLBSfN2/" 
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900/40 border border-gray-800/80 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all duration-300"
            >
              <FaFacebook className="w-4 h-4" />
            </a>
            <a 
              href="#" 
              aria-label="YouTube"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900/40 border border-gray-800/80 text-gray-400 hover:text-rose-500 hover:border-rose-500/30 hover:shadow-[0_0_15px_rgba(244,63,94,0.1)] transition-all duration-300"
            >
              <FaYoutube className="w-4 h-4" />
            </a>
          </div>

        </div>

        {/* Bottom Metadata Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-gray-500 tracking-wide">
          <p>© {currentYear} The Benaras Beats. All rights reserved.</p>
          
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <a href="/terms" className="hover:text-gray-300 transition-colors">Terms &amp; Conditions</a>
            <a href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="/refund-policy" className="hover:text-gray-300 transition-colors">Refund Policy</a>
            <a href="/contact" className="hover:text-gray-300 transition-colors">Contact Us</a>
          </div>
        </div>

      </div>
    </footer>
  );
}