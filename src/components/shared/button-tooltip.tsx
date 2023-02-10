import React from "react";
import Popup, { type PopupProps } from "@/components/shared/popup";
import CircleButton, { type CircleButtonProps } from "./circle-button";

interface ButtonTooltipProps extends CircleButtonProps {
  tooltip?: React.ReactNode;
  popupProps?: PopupProps;
  reference?: React.ReactNode;
}

const ButtonTooltip: React.FC<ButtonTooltipProps> = ({
  tooltip,
  popupProps,
  children,
  reference,
  ...props
}) => {
  const buttonReference = reference || (
    <CircleButton secondary {...props}>
      {children}
    </CircleButton>
  );

  return (
    <Popup
      reference={buttonReference}
      className="!py-1.5 !px-2 text-sm"
      placement="top"
      showArrow
      {...popupProps}
    >
      {tooltip}
    </Popup>
  );
};

export default React.memo(ButtonTooltip);
