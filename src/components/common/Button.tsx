import React from "react";
import clsx from "classnames";

import styles from "./Button.module.scss";

type ButtonColor =
  | "default"
  | "primary"
  | "primary-outline"
  | "secondary"
  | "white"
  | "transparent"
  | "success"
  | "danger"
  | "danger-outline";

type ButtonSize = "default" | "small" | "medium" | "large";

type ButtonProps = {
  children?: any;
  className?: string;
  type?: "button" | "submit" | "reset";
  title?: string;
  size?: ButtonSize;
  color?: ButtonColor;
  disabled?: boolean;
  onClick?: (e: any) => void;
};

const Button: React.FC<ButtonProps> = ({
  children,
  type = "button",
  size = "default",
  color = "default",
  className = "",
  disabled = false,
  onClick,
  ...other
}) => (
  <button
    className={clsx(styles.button, className, {
      [styles[size]]: !!size,
      [styles[color]]: !!color,
      [styles.disabled]: disabled,
    })}
    disabled={disabled}
    onClick={onClick}
    type={type}
    {...other}
  >
    {children}
  </button>
);

export { Button };
export type { ButtonColor, ButtonSize };
