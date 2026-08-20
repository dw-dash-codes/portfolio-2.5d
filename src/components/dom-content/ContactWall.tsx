import React, { useState } from 'react';
import { Badge } from '../ui/Badge';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Twitter, Copy, Check } from 'lucide-react';

interface ContactWallProps {
  opacity?: number;
}

export const ContactWall: React.FC<ContactWallProps> = ({ opacity = 1 }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('hello@yourstudio.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{ opacity, transition: 'opacity 0.3s ease' }}
      className="absolute inset-0 flex flex-col justify-center items-center p-6 md:p-12 z-30 pointer-events-auto text-ink-600"
    >
      <div className="w-full max-w-2xl text-center space-y-8">
        <div className="space-y-3">
          <Badge variant="sand">FRAME 06 // DESTINATION</Badge>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ink-600 uppercase font-display">
            LET'S BUILD SOMETHING GREAT
          </h2>
          <p className="text-ink-600/80 text-sm sm:text-base font-light max-w-lg mx-auto">
            Available for full-stack engineering, web application development, and software architecture consulting.
          </p>
        </div>

        {/* Contact Links Hub */}
        <div className="p-6 sm:p-8 rounded-2xl bg-sand-50/95 border border-sand-400/40 backdrop-blur-xl shadow-2xl space-y-6 text-ink-600">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-sand-200/50 border border-sand-400/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sand-400/20 border border-sand-400/40 flex items-center justify-center">
                <Mail className="w-5 h-5 text-ink-600" />
              </div>
              <div className="text-left">
                <div className="text-xs font-mono text-sand-400 uppercase tracking-wider font-semibold">Email Inquiry</div>
                <a
                  href="mailto:hello@yourstudio.com"
                  className="text-base font-medium text-ink-600 hover:text-sand-400 transition-colors"
                >
                  hello@yourstudio.com
                </a>
              </div>
            </div>

            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-ink-600 hover:bg-ink-600/90 text-sand-50 text-xs font-mono tracking-wider transition-colors shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  COPIED
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  COPY EMAIL
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs text-ink-600">
            <div className="p-3 rounded-lg bg-sand-200/30 border border-sand-400/20 flex items-center justify-center gap-2">
              <Phone className="w-3.5 h-3.5 text-sand-400" />
              <span>+1 (234) 567-8901</span>
            </div>
            <div className="p-3 rounded-lg bg-sand-200/30 border border-sand-400/20 flex items-center justify-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-sand-400" />
              <span>Remote Worldwide</span>
            </div>
            <div className="p-3 rounded-lg bg-sand-200/30 border border-sand-400/20 flex items-center justify-center gap-2">
              <Globe className="w-3.5 h-3.5 text-sand-400" />
              <a href="https://yourstudio.com" target="_blank" rel="noreferrer" className="hover:underline">
                yourstudio.com
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center items-center gap-4 pt-2">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn Profile"
              className="w-10 h-10 rounded-full border border-sand-400/40 flex items-center justify-center text-ink-600 hover:text-sand-50 hover:bg-ink-600 hover:border-ink-600 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub Profile"
              className="w-10 h-10 rounded-full border border-sand-400/40 flex items-center justify-center text-ink-600 hover:text-sand-50 hover:bg-ink-600 hover:border-ink-600 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter Profile"
              className="w-10 h-10 rounded-full border border-sand-400/40 flex items-center justify-center text-ink-600 hover:text-sand-50 hover:bg-ink-600 hover:border-ink-600 transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
