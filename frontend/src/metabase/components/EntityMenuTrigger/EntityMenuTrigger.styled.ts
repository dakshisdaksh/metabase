// eslint-disable-next-line no-restricted-imports
import styled from "@emotion/styled";

import Button from "metabase/core/components/Button";

export interface EntityMenuIconButtonProps {
  className?: string;
  color?: string;
  hover?: {
    color: string;
    backgroundColor: string;
  };
  "data-testid"?: string;
}

export const EntityMenuIconButton = styled(Button)<EntityMenuIconButtonProps>`
  width: 36px;
  height: 36px;

  ${({ color }) => (color ? `color: ${color}` : null)};

  &:hover {
    ${({ hover }) => (hover?.color ? `color: ${hover.color}` : null)};
    background-color: ${({ hover }) =>
      hover?.backgroundColor
        ? hover.backgroundColor
        : "var(--mb-color-bg-medium)"};
  }
`;

EntityMenuIconButton.defaultProps = {
  iconSize: 16,
  onlyIcon: true,
};
