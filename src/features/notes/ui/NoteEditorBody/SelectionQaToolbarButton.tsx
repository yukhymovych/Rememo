import { useComponentsContext } from '@blocknote/react';
import { RiQuestionLine } from 'react-icons/ri';

interface SelectionQaToolbarButtonProps {
  label: string;
  tooltip: string;
  onClick: () => void;
  isDisabled: boolean;
}

export function SelectionQaToolbarButton({
  label,
  tooltip,
  onClick,
  isDisabled,
}: SelectionQaToolbarButtonProps) {
  const components = useComponentsContext();
  if (!components) return null;

  return (
    <components.FormattingToolbar.Button
      className="bn-button"
      label={label}
      mainTooltip={tooltip}
      icon={<RiQuestionLine />}
      onClick={onClick}
      isDisabled={isDisabled}
    />
  );
}
