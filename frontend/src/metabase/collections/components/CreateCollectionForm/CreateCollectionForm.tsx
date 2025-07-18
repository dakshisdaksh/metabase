import { useCallback, useMemo } from "react";
import { withRouter } from "react-router";
import { t } from "ttag";
import _ from "underscore";
import * as Yup from "yup";

import FormCollectionPicker from "metabase/collections/containers/FormCollectionPicker";
import Button from "metabase/common/components/Button";
import type { FilterItemsInPersonalCollection } from "metabase/common/components/EntityPicker";
import FormErrorMessage from "metabase/common/components/FormErrorMessage";
import { FormFooter } from "metabase/common/components/FormFooter";
import FormInput from "metabase/common/components/FormInput";
import FormSubmitButton from "metabase/common/components/FormSubmitButton";
import FormTextArea from "metabase/common/components/FormTextArea";
import Collections, {
  DEFAULT_COLLECTION_COLOR_ALIAS,
} from "metabase/entities/collections";
import { Form, FormProvider } from "metabase/forms";
import { color } from "metabase/lib/colors";
import * as Errors from "metabase/lib/errors";
import { connect } from "metabase/lib/redux";
import type { Collection } from "metabase-types/api";
import type { State } from "metabase-types/store";

import { FormAuthorityLevelField } from "../../containers/FormAuthorityLevelFieldContainer";

const COLLECTION_SCHEMA = Yup.object({
  name: Yup.string()
    .required(Errors.required)
    .max(100, Errors.maxLength)
    .default(""),
  description: Yup.string().nullable().max(255, Errors.maxLength).default(null),
  color: Yup.string()
    .nullable()
    .default(() => color(DEFAULT_COLLECTION_COLOR_ALIAS)),
  authority_level: Yup.mixed().oneOf(["official", null]).default(null),
  parent_id: Yup.number().nullable(),
});

interface CreateCollectionProperties {
  name: string;
  description: string | null;
  color: string | null;
  parent_id: Collection["id"];
}

export interface CreateCollectionFormOwnProps {
  collectionId?: Collection["id"]; // can be used by `getInitialCollectionId`
  onCreate?: (collection: Collection) => void;
  onCancel?: () => void;
  filterPersonalCollections?: FilterItemsInPersonalCollection;
}

interface CreateCollectionFormStateProps {
  initialCollectionId: Collection["id"];
}

interface CreateCollectionFormDispatchProps {
  handleCreateCollection: (
    collection: CreateCollectionProperties,
  ) => Promise<Collection>;
}

type Props = CreateCollectionFormOwnProps &
  CreateCollectionFormStateProps &
  CreateCollectionFormDispatchProps;

function mapStateToProps(
  state: State,
  props: CreateCollectionFormOwnProps,
): CreateCollectionFormStateProps {
  return {
    initialCollectionId: Collections.selectors.getInitialCollectionId(
      state,
      props,
    ),
  };
}

const mapDispatchToProps = {
  handleCreateCollection: Collections.actions.create,
};

function CreateCollectionForm({
  initialCollectionId,
  handleCreateCollection,
  onCreate,
  onCancel,
  filterPersonalCollections,
}: Props) {
  const initialValues = useMemo(
    () => ({
      ...COLLECTION_SCHEMA.getDefault(),
      parent_id: initialCollectionId,
    }),
    [initialCollectionId],
  );

  const handleCreate = useCallback(
    async (values: CreateCollectionProperties) => {
      const action = await handleCreateCollection(values);
      const collection = Collections.HACK_getObjectFromAction(action);
      onCreate?.(collection);
    },
    [handleCreateCollection, onCreate],
  );

  return (
    <FormProvider
      initialValues={initialValues}
      validationSchema={COLLECTION_SCHEMA}
      onSubmit={handleCreate}
    >
      {({ dirty }) => (
        <Form>
          <FormInput
            name="name"
            title={t`Name`}
            placeholder={t`My new fantastic collection`}
            data-autofocus
          />
          <FormTextArea
            name="description"
            title={t`Description`}
            placeholder={t`It's optional but oh, so helpful`}
            nullable
            optional
          />
          <FormCollectionPicker
            name="parent_id"
            title={t`Collection it's saved in`}
            filterPersonalCollections={filterPersonalCollections}
          />
          <FormAuthorityLevelField />
          <FormFooter>
            <FormErrorMessage inline />
            {!!onCancel && (
              <Button type="button" onClick={onCancel}>{t`Cancel`}</Button>
            )}
            <FormSubmitButton title={t`Create`} disabled={!dirty} primary />
          </FormFooter>
        </Form>
      )}
    </FormProvider>
  );
}

// eslint-disable-next-line import/no-default-export -- deprecated usage
export default _.compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(CreateCollectionForm);
