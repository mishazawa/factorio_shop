type ButtonCommon = {
  onClick?: () => void;
};

type TextButtonProps = ButtonCommon & {
  children?: string;
};

type IconButtonProps = ButtonCommon & {
  icon: string;
  tooltip?: string;
};

export function TextButton({ children, onClick }: TextButtonProps) {
  return (
    <button onClick={onClick} className="Text-button bordered-dark-concave">
      {children}
    </button>
  );
}

export function IconButton({ icon, tooltip, onClick }: IconButtonProps) {
  return (
    <button
      title={tooltip}
      onClick={onClick}
      className="Icon-button tr-fast bordered-dark-concave"
    >
      <img src={icon} alt={tooltip} />
    </button>
  );
}
