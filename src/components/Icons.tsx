interface IconProps {
  size?: number;
  className?: string;
}

export const ArrowRightUpLine = ({ size = 16, className = "" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    className={className}
  >
    <path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z" />
  </svg>
);

export const ArrowDownLine = ({ size = 16, className = "" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    className={className}
  >
    <path d="M13 16.172L18.364 10.808L19.778 12.222L12 20L4.22205 12.222L5.63605 10.808L11 16.172V4H13V16.172Z" />
  </svg>
);
