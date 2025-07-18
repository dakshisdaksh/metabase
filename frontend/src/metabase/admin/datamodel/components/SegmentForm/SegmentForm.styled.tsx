// eslint-disable-next-line no-restricted-imports
import styled from "@emotion/styled";

import Button from "metabase/common/components/Button";
import {
  breakpointMinMedium,
  breakpointMinSmall,
} from "metabase/styled-components/theme";

export const FormRoot = styled.form`
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: var(--mb-color-bg-white);
`;

export const FormSection = styled.div`
  margin: 0 auto;
  padding: 0 1em;

  ${breakpointMinSmall} {
    padding-left: 1.75rem;
    padding-right: 1.75rem;
  }

  ${breakpointMinMedium} {
    padding-left: 2.625rem;
    padding-right: 2.625rem;
  }
`;

export const FormBody = styled(FormSection)`
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

export const FormBodyContent = styled.div`
  max-width: 36rem;
`;

export const FormFooter = styled.div`
  padding-top: 2rem;
  padding-bottom: 2rem;
  border-top: 1px solid var(--mb-color-border);
`;

export const FormFooterContent = styled.div`
  display: flex;
  align-items: center;
`;

export const FormSubmitButton = styled(Button)`
  margin-right: 1rem;
`;
