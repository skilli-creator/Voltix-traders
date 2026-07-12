// src/pages/Derivdash.jsx (Swipeable Version with Sidebar + Fullscreen + Theme Switch)

import React, { useState, useRef, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import TopBar from '../components/TopBar';
import OptionSideBar from '../components/OptionSideBar';
import LeftPanel from '../components/LeftPanel';
import ChartPanel from '../components/ChartPanel';
import RightPanel from '../components/RightPanel';

// ===== THEME DEFINITIONS - ALL COLORS FROM THEME COLOR MAP =====
const themes = {
  // 🖤 Base Darks
  black: {
    name: 'Black',
    colors: {
      background: '#0b0f1a',
      backgroundSecondary: '#0f131a',
      backgroundTertiary: '#1a1f2f',
      text: '#f1f5f9',
      textSecondary: '#8a93a6',
      textMuted: '#5a6378',
      border: '#1e2a3a',
      accent: '#2962ff',
      accentHover: '#4a7aff',
      accentActive: 'rgba(41, 98, 255, 0.15)',
      card: '#141a2a',
      shadow: 'rgba(0, 0, 0, 0.3)',
      tabActive: 'rgba(41, 98, 255, 0.15)',
      scrollbar: '#2a2e3d',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  dark: {
    name: 'Dark',
    colors: {
      background: '#111827',
      backgroundSecondary: '#161b22',
      backgroundTertiary: '#1c2333',
      text: '#f0f6fc',
      textSecondary: '#8b949e',
      textMuted: '#484f58',
      border: '#30363d',
      accent: '#58a6ff',
      accentHover: '#79c0ff',
      accentActive: 'rgba(88, 166, 255, 0.15)',
      card: '#161b22',
      shadow: 'rgba(0, 0, 0, 0.4)',
      tabActive: 'rgba(88, 166, 255, 0.15)',
      scrollbar: '#21262d',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  darkBlue: {
    name: 'Dark Blue',
    colors: {
      background: '#0f172a',
      backgroundSecondary: '#0f1f3a',
      backgroundTertiary: '#162a4a',
      text: '#e8edf5',
      textSecondary: '#8899bb',
      textMuted: '#4a5a7a',
      border: '#1a2a4a',
      accent: '#4dabf7',
      accentHover: '#74c0fc',
      accentActive: 'rgba(77, 171, 247, 0.15)',
      card: '#0f1f3a',
      shadow: 'rgba(0, 10, 30, 0.5)',
      tabActive: 'rgba(77, 171, 247, 0.15)',
      scrollbar: '#1a2a4a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  midnight: {
    name: 'Midnight',
    colors: {
      background: '#0b132b',
      backgroundSecondary: '#13152a',
      backgroundTertiary: '#1a1d3a',
      text: '#e8e8ff',
      textSecondary: '#8a8ac0',
      textMuted: '#4a4a7a',
      border: '#1a1d3a',
      accent: '#7c7cf8',
      accentHover: '#9d9dfa',
      accentActive: 'rgba(124, 124, 248, 0.15)',
      card: '#13152a',
      shadow: 'rgba(0, 0, 20, 0.5)',
      tabActive: 'rgba(124, 124, 248, 0.15)',
      scrollbar: '#1a1d3a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  charcoal: {
    name: 'Charcoal',
    colors: {
      background: '#1f2937',
      backgroundSecondary: '#2a3442',
      backgroundTertiary: '#354050',
      text: '#f0f4f8',
      textSecondary: '#9ca3af',
      textMuted: '#6b7280',
      border: '#374151',
      accent: '#60a5fa',
      accentHover: '#93bbfc',
      accentActive: 'rgba(96, 165, 250, 0.15)',
      card: '#2a3442',
      shadow: 'rgba(0, 0, 0, 0.4)',
      tabActive: 'rgba(96, 165, 250, 0.15)',
      scrollbar: '#374151',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  slate: {
    name: 'Slate',
    colors: {
      background: '#334155',
      backgroundSecondary: '#3d4a5c',
      backgroundTertiary: '#475569',
      text: '#e8ecf0',
      textSecondary: '#94a3b8',
      textMuted: '#64748b',
      border: '#4a5568',
      accent: '#818cf8',
      accentHover: '#a5b4fc',
      accentActive: 'rgba(129, 140, 248, 0.15)',
      card: '#3d4a5c',
      shadow: 'rgba(0, 0, 0, 0.4)',
      tabActive: 'rgba(129, 140, 248, 0.15)',
      scrollbar: '#4a5568',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  cosmic: {
    name: 'Cosmic',
    colors: {
      background: '#1e1b4b',
      backgroundSecondary: '#2a235a',
      backgroundTertiary: '#362a6a',
      text: '#e8e0ff',
      textSecondary: '#b8a0f0',
      textMuted: '#6a5a9a',
      border: '#3a2a6a',
      accent: '#7c3aed',
      accentHover: '#9d6df2',
      accentActive: 'rgba(124, 58, 237, 0.15)',
      card: '#2a235a',
      shadow: 'rgba(10, 0, 30, 0.5)',
      tabActive: 'rgba(124, 58, 237, 0.15)',
      scrollbar: '#3a2a6a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  // 🌿 Dark Naturals
  darkGreen: {
    name: 'Dark Green',
    colors: {
      background: '#052e16',
      backgroundSecondary: '#0a3d1e',
      backgroundTertiary: '#0f4a26',
      text: '#e8f5e8',
      textSecondary: '#8ab88a',
      textMuted: '#4a7a4a',
      border: '#1a3a1a',
      accent: '#48bb78',
      accentHover: '#68d391',
      accentActive: 'rgba(72, 187, 120, 0.15)',
      card: '#0a3d1e',
      shadow: 'rgba(0, 20, 0, 0.4)',
      tabActive: 'rgba(72, 187, 120, 0.15)',
      scrollbar: '#1a3a1a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  forest: {
    name: 'Forest',
    colors: {
      background: '#14532d',
      backgroundSecondary: '#1a633a',
      backgroundTertiary: '#207047',
      text: '#e8f0e8',
      textSecondary: '#90b890',
      textMuted: '#5a7a5a',
      border: '#1a2a1a',
      accent: '#52b788',
      accentHover: '#76c8a0',
      accentActive: 'rgba(82, 183, 136, 0.15)',
      card: '#1a633a',
      shadow: 'rgba(0, 20, 0, 0.4)',
      tabActive: 'rgba(82, 183, 136, 0.15)',
      scrollbar: '#1a2a1a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  emerald: {
    name: 'Emerald',
    colors: {
      background: '#065f46',
      backgroundSecondary: '#0a7355',
      backgroundTertiary: '#0e8563',
      text: '#e8f5f0',
      textSecondary: '#8ac4b0',
      textMuted: '#4a8a78',
      border: '#1a4a3a',
      accent: '#34d399',
      accentHover: '#6ee7b7',
      accentActive: 'rgba(52, 211, 153, 0.15)',
      card: '#0a7355',
      shadow: 'rgba(0, 20, 10, 0.4)',
      tabActive: 'rgba(52, 211, 153, 0.15)',
      scrollbar: '#1a4a3a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  // 🤍 Light Neutrals
  white: {
    name: 'White',
    colors: {
      background: '#f9fafb',
      backgroundSecondary: '#ffffff',
      backgroundTertiary: '#f8f9fa',
      text: '#1a1a2e',
      textSecondary: '#4a4a5a',
      textMuted: '#8a8a9a',
      border: '#dce0e5',
      accent: '#2563eb',
      accentHover: '#3b82f6',
      accentActive: 'rgba(37, 99, 235, 0.1)',
      card: '#ffffff',
      shadow: 'rgba(0, 0, 0, 0.08)',
      tabActive: 'rgba(37, 99, 235, 0.1)',
      scrollbar: '#c8ced4',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  lightGray: {
    name: 'Light Gray',
    colors: {
      background: '#e5e7eb',
      backgroundSecondary: '#f5f7fa',
      backgroundTertiary: '#ffffff',
      text: '#1a1a2e',
      textSecondary: '#4a4a5a',
      textMuted: '#8a8a9a',
      border: '#d0d5dd',
      accent: '#4a6cf7',
      accentHover: '#6b8af8',
      accentActive: 'rgba(74, 108, 247, 0.1)',
      card: '#ffffff',
      shadow: 'rgba(0, 0, 0, 0.06)',
      tabActive: 'rgba(74, 108, 247, 0.1)',
      scrollbar: '#c8ced4',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  gray: {
    name: 'Gray',
    colors: {
      background: '#9ca3af',
      backgroundSecondary: '#b0b8c4',
      backgroundTertiary: '#c4cbd6',
      text: '#1a1a2e',
      textSecondary: '#4a4a5a',
      textMuted: '#6a6a7a',
      border: '#8a929e',
      accent: '#4a6cf7',
      accentHover: '#6b8af8',
      accentActive: 'rgba(74, 108, 247, 0.1)',
      card: '#b0b8c4',
      shadow: 'rgba(0, 0, 0, 0.1)',
      tabActive: 'rgba(74, 108, 247, 0.1)',
      scrollbar: '#8a929e',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  coolGray: {
    name: 'Cool Gray',
    colors: {
      background: '#6b7280',
      backgroundSecondary: '#7a8290',
      backgroundTertiary: '#8a92a0',
      text: '#f0f2f5',
      textSecondary: '#b0b8c4',
      textMuted: '#8a8a9a',
      border: '#5a6270',
      accent: '#818cf8',
      accentHover: '#a5b4fc',
      accentActive: 'rgba(129, 140, 248, 0.15)',
      card: '#7a8290',
      shadow: 'rgba(0, 0, 0, 0.2)',
      tabActive: 'rgba(129, 140, 248, 0.15)',
      scrollbar: '#5a6270',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  silver: {
    name: 'Silver',
    colors: {
      background: '#cbd5f5',
      backgroundSecondary: '#d8e0f8',
      backgroundTertiary: '#e5ebfa',
      text: '#1a1a2e',
      textSecondary: '#4a4a5a',
      textMuted: '#8a8a9a',
      border: '#b8c4e8',
      accent: '#4a6cf7',
      accentHover: '#6b8af8',
      accentActive: 'rgba(74, 108, 247, 0.1)',
      card: '#d8e0f8',
      shadow: 'rgba(0, 0, 0, 0.06)',
      tabActive: 'rgba(74, 108, 247, 0.1)',
      scrollbar: '#b8c4e8',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  // 🔵 Blues
  blue: {
    name: 'Blue',
    colors: {
      background: '#1d4ed8',
      backgroundSecondary: '#2563eb',
      backgroundTertiary: '#3b82f6',
      text: '#f0f6fe',
      textSecondary: '#b8c8f0',
      textMuted: '#6a8ab8',
      border: '#1a3a6a',
      accent: '#60a5fa',
      accentHover: '#93bbfc',
      accentActive: 'rgba(96, 165, 250, 0.15)',
      card: '#2563eb',
      shadow: 'rgba(0, 10, 40, 0.4)',
      tabActive: 'rgba(96, 165, 250, 0.15)',
      scrollbar: '#1a4a7a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  sky: {
    name: 'Sky',
    colors: {
      background: '#0ea5e9',
      backgroundSecondary: '#38bdf8',
      backgroundTertiary: '#7dd3fc',
      text: '#0a1628',
      textSecondary: '#1a2a4a',
      textMuted: '#4a6a8a',
      border: '#0a8ab8',
      accent: '#0284c7',
      accentHover: '#0ea5e9',
      accentActive: 'rgba(2, 132, 199, 0.15)',
      card: '#38bdf8',
      shadow: 'rgba(0, 20, 40, 0.3)',
      tabActive: 'rgba(2, 132, 199, 0.15)',
      scrollbar: '#0a8ab8',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  ocean: {
    name: 'Ocean',
    colors: {
      background: '#0369a1',
      backgroundSecondary: '#0a7ab8',
      backgroundTertiary: '#128ac8',
      text: '#e8f4f8',
      textSecondary: '#8ac4d8',
      textMuted: '#4a7a8a',
      border: '#1a3a52',
      accent: '#4dd0e1',
      accentHover: '#80deea',
      accentActive: 'rgba(77, 208, 225, 0.15)',
      card: '#0a7ab8',
      shadow: 'rgba(0, 20, 40, 0.4)',
      tabActive: 'rgba(77, 208, 225, 0.15)',
      scrollbar: '#1a4a5a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  navy: {
    name: 'Navy',
    colors: {
      background: '#1e3a8a',
      backgroundSecondary: '#2a4a9a',
      backgroundTertiary: '#365aaa',
      text: '#e8ecf8',
      textSecondary: '#b0b8e0',
      textMuted: '#6a7aaa',
      border: '#1a2a6a',
      accent: '#818cf8',
      accentHover: '#a5b4fc',
      accentActive: 'rgba(129, 140, 248, 0.15)',
      card: '#2a4a9a',
      shadow: 'rgba(0, 0, 30, 0.4)',
      tabActive: 'rgba(129, 140, 248, 0.15)',
      scrollbar: '#1a2a6a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  indigo: {
    name: 'Indigo',
    colors: {
      background: '#4f46e5',
      backgroundSecondary: '#6366f1',
      backgroundTertiary: '#818cf8',
      text: '#f0ecfc',
      textSecondary: '#c8c4f0',
      textMuted: '#7a78aa',
      border: '#3a32b8',
      accent: '#a5b4fc',
      accentHover: '#c7d2fe',
      accentActive: 'rgba(165, 180, 252, 0.15)',
      card: '#6366f1',
      shadow: 'rgba(20, 0, 40, 0.4)',
      tabActive: 'rgba(165, 180, 252, 0.15)',
      scrollbar: '#3a32b8',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  // 🟣 Purples & Pinks
  purple: {
    name: 'Purple',
    colors: {
      background: '#6d28d9',
      backgroundSecondary: '#7c3aed',
      backgroundTertiary: '#8b5cf6',
      text: '#f0e8f8',
      textSecondary: '#c8a8f0',
      textMuted: '#7a5a9a',
      border: '#2a1a4a',
      accent: '#b388ff',
      accentHover: '#ccb0ff',
      accentActive: 'rgba(179, 136, 255, 0.15)',
      card: '#7c3aed',
      shadow: 'rgba(20, 0, 40, 0.4)',
      tabActive: 'rgba(179, 136, 255, 0.15)',
      scrollbar: '#2a1a4a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  violet: {
    name: 'Violet',
    colors: {
      background: '#7c3aed',
      backgroundSecondary: '#8b5cf6',
      backgroundTertiary: '#9b6df8',
      text: '#f0e8f8',
      textSecondary: '#c8b0f0',
      textMuted: '#7a5a9a',
      border: '#2a1a4a',
      accent: '#b388ff',
      accentHover: '#ccb0ff',
      accentActive: 'rgba(179, 136, 255, 0.15)',
      card: '#8b5cf6',
      shadow: 'rgba(20, 0, 40, 0.4)',
      tabActive: 'rgba(179, 136, 255, 0.15)',
      scrollbar: '#2a1a4a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  lavender: {
    name: 'Lavender',
    colors: {
      background: '#a78bfa',
      backgroundSecondary: '#b8a0fc',
      backgroundTertiary: '#c8b4fe',
      text: '#0a0a1a',
      textSecondary: '#2a2a4a',
      textMuted: '#5a5a8a',
      border: '#8a70e8',
      accent: '#7c3aed',
      accentHover: '#9d6df2',
      accentActive: 'rgba(124, 58, 237, 0.15)',
      card: '#b8a0fc',
      shadow: 'rgba(20, 0, 40, 0.2)',
      tabActive: 'rgba(124, 58, 237, 0.15)',
      scrollbar: '#8a70e8',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  pink: {
    name: 'Pink',
    colors: {
      background: '#db2777',
      backgroundSecondary: '#ec4899',
      backgroundTertiary: '#f472b6',
      text: '#f8e8f0',
      textSecondary: '#f0a8c8',
      textMuted: '#9a5a7a',
      border: '#4a1a30',
      accent: '#ff80ab',
      accentHover: '#ffa0c4',
      accentActive: 'rgba(255, 128, 171, 0.15)',
      card: '#ec4899',
      shadow: 'rgba(40, 0, 20, 0.4)',
      tabActive: 'rgba(255, 128, 171, 0.15)',
      scrollbar: '#4a1a30',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  rose: {
    name: 'Rose',
    colors: {
      background: '#f43f5e',
      backgroundSecondary: '#f5607a',
      backgroundTertiary: '#f88098',
      text: '#f8e8e8',
      textSecondary: '#f0a8b0',
      textMuted: '#9a5a62',
      border: '#4a1a1a',
      accent: '#ff80a0',
      accentHover: '#ffa0b8',
      accentActive: 'rgba(255, 128, 160, 0.15)',
      card: '#f5607a',
      shadow: 'rgba(40, 0, 0, 0.4)',
      tabActive: 'rgba(255, 128, 160, 0.15)',
      scrollbar: '#4a1a1a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  // 🔴 Warm Colors
  red: {
    name: 'Red',
    colors: {
      background: '#dc2626',
      backgroundSecondary: '#ef4444',
      backgroundTertiary: '#f87171',
      text: '#f8e8e8',
      textSecondary: '#e88a8a',
      textMuted: '#b85a5a',
      border: '#4a1a1a',
      accent: '#ff6b6b',
      accentHover: '#ff8a8a',
      accentActive: 'rgba(255, 107, 107, 0.15)',
      card: '#ef4444',
      shadow: 'rgba(30, 0, 0, 0.4)',
      tabActive: 'rgba(255, 107, 107, 0.15)',
      scrollbar: '#4a1a1a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  crimson: {
    name: 'Crimson',
    colors: {
      background: '#b91c1c',
      backgroundSecondary: '#d12a2a',
      backgroundTertiary: '#e83838',
      text: '#f8e8e8',
      textSecondary: '#e88a8a',
      textMuted: '#b85a5a',
      border: '#4a1a1a',
      accent: '#ff6b6b',
      accentHover: '#ff8a8a',
      accentActive: 'rgba(255, 107, 107, 0.15)',
      card: '#d12a2a',
      shadow: 'rgba(30, 0, 0, 0.4)',
      tabActive: 'rgba(255, 107, 107, 0.15)',
      scrollbar: '#4a1a1a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  orange: {
    name: 'Orange',
    colors: {
      background: '#ea580c',
      backgroundSecondary: '#f97316',
      backgroundTertiary: '#fb923c',
      text: '#f8f0e8',
      textSecondary: '#f0c8a8',
      textMuted: '#9a7a5a',
      border: '#4a2a1a',
      accent: '#ff8a50',
      accentHover: '#ffa070',
      accentActive: 'rgba(255, 138, 80, 0.15)',
      card: '#f97316',
      shadow: 'rgba(30, 15, 0, 0.4)',
      tabActive: 'rgba(255, 138, 80, 0.15)',
      scrollbar: '#4a2a1a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  amber: {
    name: 'Amber',
    colors: {
      background: '#f59e0b',
      backgroundSecondary: '#fbbf24',
      backgroundTertiary: '#fcd34d',
      text: '#1a1a0a',
      textSecondary: '#4a4a1a',
      textMuted: '#8a8a4a',
      border: '#4a3a1a',
      accent: '#ffd54f',
      accentHover: '#ffe082',
      accentActive: 'rgba(255, 213, 79, 0.15)',
      card: '#fbbf24',
      shadow: 'rgba(30, 30, 0, 0.3)',
      tabActive: 'rgba(255, 213, 79, 0.15)',
      scrollbar: '#4a3a1a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  yellow: {
    name: 'Yellow',
    colors: {
      background: '#eab308',
      backgroundSecondary: '#facc15',
      backgroundTertiary: '#fde047',
      text: '#1a1a0a',
      textSecondary: '#4a4a1a',
      textMuted: '#8a8a4a',
      border: '#4a4a1a',
      accent: '#ffd54f',
      accentHover: '#ffe082',
      accentActive: 'rgba(255, 213, 79, 0.15)',
      card: '#facc15',
      shadow: 'rgba(30, 30, 0, 0.3)',
      tabActive: 'rgba(255, 213, 79, 0.15)',
      scrollbar: '#4a4a1a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  gold: {
    name: 'Gold',
    colors: {
      background: '#d4af37',
      backgroundSecondary: '#e0c04a',
      backgroundTertiary: '#e8d05a',
      text: '#1a150a',
      textSecondary: '#4a3a1a',
      textMuted: '#8a7a4a',
      border: '#4a3a1a',
      accent: '#ffd700',
      accentHover: '#ffe44d',
      accentActive: 'rgba(255, 215, 0, 0.15)',
      card: '#e0c04a',
      shadow: 'rgba(30, 25, 0, 0.3)',
      tabActive: 'rgba(255, 215, 0, 0.15)',
      scrollbar: '#4a3a1a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  // 🟢 Greens & Teals
  green: {
    name: 'Green',
    colors: {
      background: '#16a34a',
      backgroundSecondary: '#22c55e',
      backgroundTertiary: '#4ade80',
      text: '#e8f5e8',
      textSecondary: '#8ab88a',
      textMuted: '#4a7a4a',
      border: '#1a3a1a',
      accent: '#48bb78',
      accentHover: '#68d391',
      accentActive: 'rgba(72, 187, 120, 0.15)',
      card: '#22c55e',
      shadow: 'rgba(0, 20, 0, 0.4)',
      tabActive: 'rgba(72, 187, 120, 0.15)',
      scrollbar: '#1a3a1a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  lime: {
    name: 'Lime',
    colors: {
      background: '#84cc16',
      backgroundSecondary: '#a3e635',
      backgroundTertiary: '#bef264',
      text: '#1a1a0a',
      textSecondary: '#4a4a1a',
      textMuted: '#8a8a4a',
      border: '#4a4a1a',
      accent: '#d4d44a',
      accentHover: '#e0e05a',
      accentActive: 'rgba(212, 212, 74, 0.15)',
      card: '#a3e635',
      shadow: 'rgba(20, 30, 0, 0.3)',
      tabActive: 'rgba(212, 212, 74, 0.15)',
      scrollbar: '#4a4a1a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  teal: {
    name: 'Teal',
    colors: {
      background: '#0d9488',
      backgroundSecondary: '#14b8a6',
      backgroundTertiary: '#2dd4bf',
      text: '#e8f8f8',
      textSecondary: '#8ad8d8',
      textMuted: '#5a9a9a',
      border: '#1a4a4a',
      accent: '#4dd0b0',
      accentHover: '#80dec8',
      accentActive: 'rgba(77, 208, 176, 0.15)',
      card: '#14b8a6',
      shadow: 'rgba(0, 30, 30, 0.4)',
      tabActive: 'rgba(77, 208, 176, 0.15)',
      scrollbar: '#1a4a4a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  cyan: {
    name: 'Cyan',
    colors: {
      background: '#06b6d4',
      backgroundSecondary: '#22d3ee',
      backgroundTertiary: '#67e8f9',
      text: '#0a1a1a',
      textSecondary: '#2a5a5a',
      textMuted: '#5a8a8a',
      border: '#1a4a4a',
      accent: '#4dd0e1',
      accentHover: '#80deea',
      accentActive: 'rgba(77, 208, 225, 0.15)',
      card: '#22d3ee',
      shadow: 'rgba(0, 30, 30, 0.3)',
      tabActive: 'rgba(77, 208, 225, 0.15)',
      scrollbar: '#1a4a4a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  }
};

// ===== STYLED COMPONENTS - ALL THEME BASED =====
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: ${props => props.isFullscreen ? '100dvh' : '100vh'};
  background: ${props => props.theme.colors.background};
  overflow: hidden;
  position: relative;
  width: 100%;
  transition: background 0.3s ease;
  font-weight: 700;
  
  ${props => props.isFullscreen && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
  `}
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: ${props => props.isSidebarOpen && props.isDesktop ? '280px' : '0'};

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const DesktopLayout = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileLayout = styled.div`
  display: none;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  position: relative;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const PanelsContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const PanelWrapper = styled.div`
  flex: 0 0 100%;
  height: 100%;
  overflow-y: auto;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(-${props => props.index * 100}%);
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 2px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.scrollbar};
    border-radius: 2px;
  }
`;

const PanelContent = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const MobileTabs = styled.div`
  display: flex;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-top: 2px solid ${props => props.theme.colors.border};
  flex-shrink: 0;
  padding: 4px 8px;
  gap: 4px;
  z-index: 10;
  font-weight: 700;

  @media (max-width: 480px) {
    padding: 3px 4px;
    gap: 2px;
  }
`;

const TabButton = styled.button`
  flex: 1;
  padding: 8px 4px;
  border: 2px solid transparent;
  background: ${props => props.active ? props.theme.colors.tabActive : 'transparent'};
  color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.textSecondary};
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.textSecondary};
    transition: color 0.2s ease;
    
    svg {
      stroke: currentColor;
      transition: stroke 0.2s ease;
    }
  }

  .label {
    font-size: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 700;
  }

  &:hover {
    background: ${props => props.theme.colors.accentActive};
    border-color: ${props => props.active ? props.theme.colors.accent : 'transparent'};
    
    .icon {
      color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.text};
    }
  }

  @media (max-width: 480px) {
    padding: 6px 2px;
    .label {
      font-size: 7px;
    }
    .icon svg {
      width: 18px;
      height: 18px;
    }
  }
`;

// ===== FLOATING BUTTONS CONTAINER =====
const FloatingButtonsContainer = styled.div`
  position: fixed;
  bottom: ${props => props.isMobile ? '80px' : '24px'};
  right: ${props => props.isMobile ? '12px' : '24px'};
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;

  @media (max-width: 480px) {
    bottom: 72px;
    right: 10px;
    gap: 8px;
  }

  @media (min-width: 769px) {
    bottom: 24px;
    right: 24px;
    gap: 12px;
  }
`;

// ===== FULLSCREEN BUTTON =====
const FullscreenButton = styled.button`
  width: ${props => props.isMobile ? '44px' : '48px'};
  height: ${props => props.isMobile ? '44px' : '48px'};
  border-radius: 50%;
  border: 2px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: 0 4px 20px ${props => props.theme.colors.shadow};
  position: relative;
  font-weight: 700;

  &:hover {
    background: ${props => props.theme.colors.accentActive};
    border-color: ${props => props.theme.colors.accent};
    color: ${props => props.theme.colors.accent};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: ${props => props.isMobile ? '18px' : '22px'};
    height: ${props => props.isMobile ? '18px' : '22px'};
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

// ===== THEME SWITCH BUTTON =====
const ThemeToggleButton = styled.button`
  width: ${props => props.isMobile ? '44px' : '48px'};
  height: ${props => props.isMobile ? '44px' : '48px'};
  border-radius: 50%;
  border: 2px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.isMobile ? '18px' : '20px'};
  box-shadow: 0 4px 20px ${props => props.theme.colors.shadow};
  position: relative;
  font-weight: 700;

  &:hover {
    background: ${props => props.theme.colors.accentActive};
    border-color: ${props => props.theme.colors.accent};
    color: ${props => props.theme.colors.accent};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
`;

// ===== TOOLTIP =====
const Tooltip = styled.span`
  position: absolute;
  right: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%);
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 11px;
  white-space: nowrap;
  letter-spacing: 0.3px;
  border: 2px solid ${props => props.theme.colors.border};
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  pointer-events: none;
  font-weight: 700;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 100%;
    transform: translateY(-50%);
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 5px solid ${props => props.theme.colors.backgroundSecondary};
  }

  ${props => props.show && `
    opacity: 1;
    visibility: visible;
    transform: translateY(-50%) translateX(-4px);
  `}

  @media (max-width: 768px) {
    display: none;
  }
`;

// ===== THEME DROPDOWN =====
const ThemeDropdown = styled.div`
  position: absolute;
  bottom: calc(100% + 12px);
  right: 0;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 6px;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  flex-direction: column;
  gap: 4px;
  min-width: 160px;
  max-height: 360px;
  overflow-y: auto;
  box-shadow: 0 8px 32px ${props => props.theme.colors.shadow};
  animation: slideUp 0.2s ease;
  font-weight: 700;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.scrollbar};
    border-radius: 4px;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 480px) {
    min-width: 130px;
    right: -5px;
    max-height: 280px;
  }
`;

// ===== THEME OPTION =====
const ThemeOption = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background: ${props => props.active ? props.theme.colors.accentActive : 'transparent'};
  color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: ${props => props.active ? '700' : '400'};
  width: 100%;
  text-align: left;

  &:hover {
    background: ${props => props.theme.colors.accentActive};
    color: ${props => props.theme.colors.text};
  }

  .color-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid ${props => props.theme.colors.border};
    flex-shrink: 0;
    transition: border-color 0.2s ease;
  }

  ${props => props.active && `
    .color-dot {
      border-color: ${props.theme.colors.accent};
    }
  `}

  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 11px;
    
    .color-dot {
      width: 14px;
      height: 14px;
    }
  }
`;

// Professional SVG Icons
const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
  </svg>
);

const TradeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const PositionsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const FullscreenEnterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const FullscreenExitIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 14 10 14 10 20" />
    <polyline points="20 10 14 10 14 4" />
    <line x1="10" y1="14" x2="3" y2="21" />
    <line x1="14" y1="10" x2="21" y2="3" />
  </svg>
);

const ThemeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const panels = [
  { id: 'chart', label: 'Chart', icon: <ChartIcon />, component: ChartPanel },
  { id: 'trade', label: 'Trade', icon: <TradeIcon />, component: RightPanel },
  { id: 'positions', label: 'Positions', icon: <PositionsIcon />, component: LeftPanel },
];

// Theme color map for dots - MATCHES ALL THEMES
const themeColorMap = {
  // 🖤 Base Darks
  black: '#0b0f1a',
  dark: '#111827',
  darkBlue: '#0f172a',
  midnight: '#0b132b',
  charcoal: '#1f2937',
  slate: '#334155',
  cosmic: '#1e1b4b',

  // 🌿 Dark Naturals
  darkGreen: '#052e16',
  forest: '#14532d',
  emerald: '#065f46',

  // 🤍 Light Neutrals
  white: '#f9fafb',
  lightGray: '#e5e7eb',
  gray: '#9ca3af',
  coolGray: '#6b7280',
  silver: '#cbd5f5',

  // 🔵 Blues
  blue: '#1d4ed8',
  sky: '#0ea5e9',
  ocean: '#0369a1',
  navy: '#1e3a8a',
  indigo: '#4f46e5',

  // 🟣 Purples & Pinks
  purple: '#6d28d9',
  violet: '#7c3aed',
  lavender: '#a78bfa',
  pink: '#db2777',
  rose: '#f43f5e',

  // 🔴 Warm Colors
  red: '#dc2626',
  crimson: '#b91c1c',
  orange: '#ea580c',
  amber: '#f59e0b',
  yellow: '#eab308',
  gold: '#d4af37',

  // 🟢 Greens & Teals
  green: '#16a34a',
  lime: '#84cc16',
  teal: '#0d9488',
  cyan: '#06b6d4',
};

// ============================================
// MAIN COMPONENT
// ============================================
const Derivdash = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const containerRef = useRef(null);
  const themeDropdownRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsDesktop(!mobile);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = document.fullscreenElement !== null;
      setIsFullscreen(isFs);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target)) {
        setIsThemeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeIndex < panels.length - 1) {
        setActiveIndex(activeIndex + 1);
      } else if (diff < 0 && activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
      }
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        const element = document.documentElement;
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          await element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
          await element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          await element.msRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const toggleThemeDropdown = () => {
    setIsThemeDropdownOpen(!isThemeDropdownOpen);
  };

  const changeTheme = (themeName) => {
    setCurrentTheme(themeName);
    setIsThemeDropdownOpen(false);
  };

  return (
    <ThemeProvider theme={themes[currentTheme]}>
      <DashboardContainer 
        ref={containerRef}
        isFullscreen={isFullscreen}
      >
        <TopBar 
          isSidebarOpen={isSidebarOpen} 
          onSidebarToggle={toggleSidebar} 
        />

        <OptionSideBar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar} 
        />

        <MainContent isSidebarOpen={isSidebarOpen} isDesktop={isDesktop}>
          <DesktopLayout>
            <LeftPanel />
            <ChartPanel />
            <RightPanel />
          </DesktopLayout>

          <MobileLayout>
            <PanelsContainer
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {panels.map((panel, index) => {
                const Component = panel.component;
                return (
                  <PanelWrapper
                    key={panel.id}
                    index={activeIndex}
                    style={{
                      transform: `translateX(-${activeIndex * 100}%)`
                    }}
                  >
                    <PanelContent>
                      <Component />
                    </PanelContent>
                  </PanelWrapper>
                );
              })}
            </PanelsContainer>

            <MobileTabs>
              {panels.map((panel, index) => (
                <TabButton
                  key={panel.id}
                  active={activeIndex === index}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className="icon">{panel.icon}</span>
                  <span className="label">{panel.label}</span>
                </TabButton>
              ))}
            </MobileTabs>
          </MobileLayout>
        </MainContent>

        {/* Floating Buttons */}
        <FloatingButtonsContainer isMobile={isMobile}>
          <div ref={themeDropdownRef} style={{ position: 'relative' }}>
            <ThemeToggleButton
              onClick={toggleThemeDropdown}
              isMobile={isMobile}
              aria-label="Toggle Theme"
              onMouseEnter={() => setHoveredButton('theme')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <ThemeIcon />
              <Tooltip show={hoveredButton === 'theme' && !isMobile}>
                Change Theme
              </Tooltip>
            </ThemeToggleButton>

            <ThemeDropdown isOpen={isThemeDropdownOpen}>
              {Object.entries(themes).map(([key, theme]) => (
                <ThemeOption
                  key={key}
                  active={currentTheme === key}
                  onClick={() => changeTheme(key)}
                >
                  <span 
                    className="color-dot" 
                    style={{ background: themeColorMap[key] }}
                  />
                  {theme.name}
                </ThemeOption>
              ))}
            </ThemeDropdown>
          </div>

          <FullscreenButton 
            onClick={toggleFullscreen}
            isFullscreen={isFullscreen}
            isMobile={isMobile}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            onMouseEnter={() => setHoveredButton('fullscreen')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}
            <Tooltip show={hoveredButton === 'fullscreen' && !isMobile}>
              {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            </Tooltip>
          </FullscreenButton>
        </FloatingButtonsContainer>
      </DashboardContainer>
    </ThemeProvider>
  );
};

export default Derivdash;