import { ChangeEvent, MouseEventHandler, ReactNode, useRef } from "react";

type ButtonCommon = {
  onClick?: MouseEventHandler;
};

type TextButtonProps = ButtonCommon & {
  children?: string | ReactNode;
};

type IconButtonProps = ButtonCommon & {
  icon: string;
  tooltip?: string;
  className?: string;
};

type FileButtonProps = TextButtonProps & {
  accept?: string;
  onFile?: (file: File) => void;
};

export function FileButton({
  children,
  onFile = () => {},
  accept = ".png",
}: FileButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null!);

  function onSelectFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.currentTarget.files) return;

    const file = e.currentTarget.files[0];
    if (!file) return;
    onFile(file);
  }

  return (
    <TextButton onClick={() => inputRef.current?.click()}>
      <>
        {children}
        <input
          className="util_hidden"
          ref={inputRef}
          type="file"
          onChange={onSelectFile}
          accept={accept}
        />
      </>
    </TextButton>
  );
}

export function TextButton({ children, onClick }: TextButtonProps) {
  return (
    <button onClick={onClick} className="Text-button bordered-dark-concave">
      {children}
    </button>
  );
}

export function IconButton({
  icon,
  tooltip,
  onClick,
  className,
}: IconButtonProps) {
  return (
    <button
      title={tooltip}
      onClick={onClick}
      className={`${className} Icon-button tr-fast bordered-dark-concave`}
    >
      <img src={icon} alt={tooltip} />
    </button>
  );
}
