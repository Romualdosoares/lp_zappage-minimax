// =============================================================
//  Componentes de ícones SVG inline (sem dependências externas)
// =============================================================

const baseProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'none',
  viewBox: '0 0 24 24',
  strokeWidth: 1.6,
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function IconArrowRight({ className = 'h-4 w-4' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  )
}

export function IconArrowLeft({ className = 'h-4 w-4' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M19 12H5M11 5l-7 7 7 7" />
    </svg>
  )
}

export function IconCheck({ className = 'h-5 w-5' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M4 12l5 5L20 6" />
    </svg>
  )
}

export function IconCheckCircle({ className = 'h-5 w-5' }) {
  return (
    <svg {...baseProps} className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12.5l2.5 2.5L16 9" />
    </svg>
  )
}

export function IconShield({ className = 'h-6 w-6' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M12 3l8 3v6c0 4.5-3.5 8.5-8 9-4.5-.5-8-4.5-8-9V6l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

export function IconBolt({ className = 'h-6 w-6' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
    </svg>
  )
}

export function IconPhone({ className = 'h-6 w-6' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  )
}

export function IconStar({ className = 'h-5 w-5' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

export function IconWhatsapp({ className = 'h-6 w-6' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M17.47 14.55c-.27-.13-1.6-.79-1.84-.88-.25-.09-.43-.13-.62.13-.18.27-.71.88-.87 1.06-.16.18-.32.2-.59.07-.27-.13-1.13-.42-2.16-1.33-.8-.71-1.34-1.59-1.5-1.85-.16-.27-.02-.42.12-.55.12-.12.27-.32.4-.48.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.48-.07-.13-.62-1.5-.85-2.05-.22-.54-.45-.46-.62-.47h-.53c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29 0 1.35.99 2.66 1.13 2.84.14.18 1.95 2.97 4.72 4.16.66.28 1.18.45 1.58.58.66.21 1.27.18 1.74.11.53-.08 1.6-.65 1.82-1.28.22-.63.22-1.17.16-1.28-.07-.11-.25-.18-.52-.32zM12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.27-1.38a9.96 9.96 0 004.7 1.17h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.13-2.9-7.01A9.82 9.82 0 0012.04 2zm0 18.16c-1.5 0-2.97-.4-4.27-1.16l-.31-.18-3.12.82.83-3.05-.2-.32a8.18 8.18 0 01-1.25-4.36c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 012.42 5.83c0 4.55-3.7 8.24-8.18 8.24z" />
    </svg>
  )
}

export function IconClose({ className = 'h-5 w-5' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

export function IconMenu({ className = 'h-6 w-6' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

export function IconChevronDown({ className = 'h-5 w-5' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

export function IconLink({ className = 'h-6 w-6' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  )
}

export function IconSparkles({ className = 'h-6 w-6' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.6}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </svg>
  )
}

export function IconRocket({ className = 'h-6 w-6' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  )
}

export function IconDevice({ className = 'h-6 w-6' }) {
  return (
    <svg {...baseProps} className={className}>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M12 18h.01" />
    </svg>
  )
}

export function IconCopy({ className = 'h-6 w-6' }) {
  return (
    <svg {...baseProps} className={className}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  )
}

export function IconHeadset({ className = 'h-6 w-6' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M3 18v-6a9 9 0 0118 0v6" />
      <path d="M21 19a2 2 0 01-2 2h-1v-6h3v4zM3 19a2 2 0 002 2h1v-6H3v4z" />
    </svg>
  )
}

export function IconChart({ className = 'h-6 w-6' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 4 4 5-5" />
    </svg>
  )
}

export function IconTarget({ className = 'h-6 w-6' }) {
  return (
    <svg {...baseProps} className={className}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

export function IconQuestion({ className = 'h-6 w-6' }) {
  return (
    <svg {...baseProps} className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
    </svg>
  )
}

export function IconCrown({ className = 'h-5 w-5' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      className={className}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}
