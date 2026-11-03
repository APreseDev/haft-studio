const base = {
  width: 26,
  height: 26,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const Icon = ({ name, size = 26 }) => {
  const p = { ...base, width: size, height: size };
  switch (name) {
    case "web":
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <path d="M3 9h18M7 6.5h.01M10 6.5h.01" />
        </svg>
      );
    case "video":
      return (
        <svg {...p}>
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="M10 9.5v5l4.5-2.5z" />
        </svg>
      );
    case "phone":
      return (
        <svg {...p}>
          <rect x="7" y="3" width="10" height="18" rx="3" />
          <path d="M11 18h2" />
        </svg>
      );
    case "mega":
      return (
        <svg {...p}>
          <path d="M4 10v4h3l7 4V6L7 10H4z" />
          <path d="M18 9a4 4 0 010 6" />
        </svg>
      );
    case "call":
      return (
        <svg {...p}>
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
        </svg>
      );
    case "insta":
      return (
        <svg {...p}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <path d="M17.5 6.5h.01" />
        </svg>
      );
    case "mail":
      return (
        <svg {...p}>
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="M3 8l9 6 9-6" />
        </svg>
      );
    case "user":
      return (
        <svg {...p}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0116 0" />
        </svg>
      );
    case "arrow":
    default:
      return (
        <svg {...p}>
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      );
  }
};
