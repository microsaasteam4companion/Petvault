interface WaveDividerProps {
  fill?: string;
  className?: string;
  flip?: boolean;
}

const WaveDivider = ({ fill = "#FFFFFF", className = "", flip = false }: WaveDividerProps) => (
  <div className={`w-full overflow-hidden leading-[0] ${flip ? "rotate-180" : ""} ${className}`}>
    <svg
      viewBox="0 0 1440 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      preserveAspectRatio="none"
    >
      <path
        d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
        fill={fill}
      />
    </svg>
  </div>
);

export default WaveDivider;
