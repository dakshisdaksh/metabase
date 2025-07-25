import { t } from "ttag";

import { isNotNull } from "metabase/lib/types";
import {
  type HelpText,
  getHelpText,
  getSupportedClauses,
} from "metabase/querying/expressions";
import * as Lib from "metabase-lib";
import type Database from "metabase-lib/v1/metadata/Database";
import type Metadata from "metabase-lib/v1/metadata/Metadata";

export function getSearchPlaceholder(expressionMode: Lib.ExpressionMode) {
  if (expressionMode === "expression" || expressionMode === "filter") {
    return t`Search functions…`;
  }
  if (expressionMode === "aggregation") {
    return t`Search aggregations…`;
  }
}

function getCategoryName(category: string) {
  switch (category) {
    case "logical":
      return t`Logical functions`;
    case "math":
      return t`Math functions`;
    case "string":
      return t`String functions`;
    case "date":
      return t`Date functions`;
    case "conversion":
      return t`Conversions`;
    case "window":
      return t`Window functions`;
    case "aggregation":
      return t`Aggregations`;
  }
}

export function getFilteredClauses({
  expressionMode,
  filter,
  database,
  reportTimezone,
}: {
  expressionMode: Lib.ExpressionMode;
  filter: string;
  database: Database | null;
  reportTimezone?: string;
}) {
  const filteredClauses = getSupportedClauses({ expressionMode, database })
    .filter((clause) =>
      clause.displayName.toLowerCase().includes(filter.toLowerCase()),
    )
    .map((clause) =>
      clause.name && database
        ? getHelpText(clause.name, database, reportTimezone)
        : null,
    )
    .filter(isNotNull);

  const filteredCategories = new Set(
    filteredClauses.map((clause) => clause.category),
  );

  return Array.from(filteredCategories)
    .sort()
    .map((category) => ({
      category,
      displayName: getCategoryName(category),
      clauses: filteredClauses
        .filter((clause) => clause.category === category)
        .sort(byName),
    }));
}

function byName(a: HelpText, b: HelpText) {
  return a.displayName.localeCompare(b.displayName);
}

export function getDatabase(query: Lib.Query, metadata: Metadata) {
  const databaseId = Lib.databaseID(query);
  return metadata.database(databaseId);
}
