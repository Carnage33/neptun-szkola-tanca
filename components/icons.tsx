type IconProps = { size?: number; className?: string };

function Icon({ size = 20, className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (props: IconProps) => (
  <Icon {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

export const ArrowUp = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </Icon>
);

export const Check = (props: IconProps) => (
  <Icon {...props}>
    <path d="M5 12.5l4.5 4.5L19 7" />
  </Icon>
);

export const Sparkle = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" fill="currentColor" stroke="none" />
    <path d="M19 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" fill="currentColor" stroke="none" />
  </Icon>
);

export const Clock = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.2 2" />
  </Icon>
);

export const Pin = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </Icon>
);

export const Calendar = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </Icon>
);

export const Users = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 19.5c0-3.3 2.7-5.6 6-5.6s6 2.3 6 5.6" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M16.4 13.7c2.7.3 4.6 2.4 4.6 5.3" />
  </Icon>
);

export const User = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5" />
  </Icon>
);

export const Heart = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z" />
  </Icon>
);

export const Music = (props: IconProps) => (
  <Icon {...props}>
    <path d="M9 18V5.5l11-2.2v12.5" />
    <circle cx="6.5" cy="18" r="2.5" />
    <circle cx="17.5" cy="15.8" r="2.5" />
  </Icon>
);

export const Bolt = (props: IconProps) => (
  <Icon {...props}>
    <path d="M13 2.5L4.5 14H11l-1 7.5L19.5 10H13z" />
  </Icon>
);

export const Crown = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" />
  </Icon>
);

export const Mic = (props: IconProps) => (
  <Icon {...props}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
  </Icon>
);

export const Wallet = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3" y="6" width="18" height="14" rx="2.5" />
    <path d="M3 10h18M16.5 15h1" />
  </Icon>
);

export const Menu = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </Icon>
);

export const Close = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
);

export const Plus = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);
