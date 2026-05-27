"use client";

import React from 'react';
import Link from 'next/link';
import { Eye, Radio, Sparkles } from 'lucide-react';

const TRENDING_PROMPTS = [
  { id: 1, title: 'Cinematic Portrait', tag: 'photography', uses: '2.4k copies' },
  { id: 2, title: 'Cyberpunk Cityscape', tag: '3d-render', uses: '1.8k copies' },
  { id: 3, title: 'Minimalist Logo', tag: 'branding', uses: '956 copies' },
];

const ACTIVE_VIBES = [
  { id: 1, name: 'alex_cyber', avatar: 'https://i.pravatar.cc/150?u=1', action: 'Remixing #portrait' },
  { id: 2, name: 'sarah.design', avatar: 'https://i.pravatar.cc/150?u=2', action: 'Saved 3 prompts' },
  { id: 3, name: 'prompt_master', avatar: 'https://i.pravatar.cc/150?u=3', action: 'Browsing #3d-render' },
];

export function RightSidebar({ className = "" }: { className?: string }) {
  return (
    <aside
      className={`flex flex-col gap-6 overflow-y-auto font-sans ${className}`}
    >
      {/* Trending Prompts Container */}
      <div className="glass-card p-5 rounded-none flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-1 border-b-2 border-black" id="trending-widget-header">
          <h3 className="font-display font-black text-xs uppercase tracking-wider text-black">
            Trending Sparks
          </h3>
        </div>

        {/* List of Trending Prompts */}
        <div className="flex flex-col gap-3" id="trending-prompts-list">
          {TRENDING_PROMPTS.map((item) => (
            <Link
              key={item.id}
              href={`/tags/${item.tag}`}
              className="p-3 bg-[#f9fafb] hover:bg-neutral-100 border-2 border-black rounded-none cursor-pointer transition-all duration-150 group"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-[9px] font-black text-black uppercase tracking-wider">
                  {item.tag}
                </span>
                <span className="material-symbols-outlined text-xs text-black transition-all">
                  east
                </span>
              </div>
              <h4 className="font-display font-extrabold text-xs text-black group-hover:underline uppercase tracking-wide">
                {item.title}
              </h4>
              <p className="font-mono text-[9px] text-neutral-500 mt-1 uppercase font-bold">{item.uses}</p>
            </Link>
          ))}
        </div>

        <Link
          href="/trending"
          className="w-full text-center py-2.5 font-display font-black text-xs text-black hover:bg-neutral-100 bg-white rounded-none border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 block"
        >
          VIEW ALL TRENDS
        </Link>
      </div>

      {/* Active Vibes (Online indicators) */}
      <div className="glass-card p-5 rounded-none flex flex-col gap-4" id="active-vibes-widget">
        <div className="flex items-center gap-2 pb-1 border-b-2 border-black" id="active-widget-header">
          <span className="material-symbols-outlined text-sm text-black">
            online_prediction
          </span>
          <h3 className="font-display font-black text-xs uppercase tracking-wider text-black">
            Active Vibes
          </h3>
          <span className="ml-auto w-2 h-2 rounded-full bg-red-500 border border-black" />
        </div>

        <div className="flex flex-col gap-3" id="active-vibes-list">
          {ACTIVE_VIBES.map((user) => (
            <div
              key={user.id}
              className="flex items-start gap-3 p-2 bg-transparent hover:bg-neutral-100 border border-transparent hover:border-black rounded-none transition-all cursor-pointer"
            >
              <div className="relative flex-shrink-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-none border border-black"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-red-500 border border-black" />
              </div>

              <div className="min-w-0" id={`active-info-${user.id}`}>
                <h4 className="font-display font-black text-xs text-black leading-none truncate uppercase tracking-tight">
                  {user.name}
                </h4>
                <p className="font-sans text-[10px] text-neutral-600 mt-1 leading-normal truncate">
                  {user.action}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Micro Footer links */}
      <div className="px-4 text-center select-none" id="right-sidebar-footer">
        <div className="flex justify-center gap-3 font-mono text-[9px] text-neutral-400 font-bold uppercase mb-1.5">
          <a href="#" className="hover:text-black hover:underline">Status</a>
          <span>•</span>
          <a href="#" className="hover:text-black hover:underline">Security</a>
          <span>•</span>
          <a href="#" className="hover:text-black hover:underline">APIs</a>
        </div>
        <p className="font-mono text-[9px] text-neutral-400 uppercase font-black">
          Latency: 14ms • Secure Sandbox
        </p>
      </div>
    </aside>
  );
}
