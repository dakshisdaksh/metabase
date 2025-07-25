import { useField } from "formik";
import type { HTMLAttributes } from "react";
import { t } from "ttag";

import FormField from "metabase/common/components/FormField";
import { MappingEditor } from "metabase/common/components/MappingEditor";

interface Props extends HTMLAttributes<HTMLDivElement> {
  name: string;
  title?: string;
}

export const LoginAttributesWidget = ({
  name = "login_attributes",
  title = t`Attributes`,
  className,
  style,
}: Props) => {
  const [{ value }, , { setValue, setError }] = useField(name);

  const handleError = (error: boolean) => {
    if (error) {
      setError(t`Duplicate login attribute keys`);
    }
  };

  return (
    <FormField className={className} style={style} title={title}>
      <MappingEditor
        value={value || {}}
        onChange={setValue}
        onError={handleError}
        addText={t`Add an attribute`}
      />
    </FormField>
  );
};
