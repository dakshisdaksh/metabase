import type { ReactNode, RefObject } from "react";

import type { IconName } from "metabase/ui";
import type { DashCardId, DashboardTabId } from "metabase-types/api";

export interface Undo {
  id: string | number;
  type?: string;
  action?: (() => void) | null;
  message?: ReactNode | ((undo: Undo) => ReactNode);
  timeout?: number;
  initialTimeout?: number;
  actions?: (() => void)[];
  showProgress?: boolean;
  icon?: IconName | null;
  toastColor?: string;
  iconColor?: string;
  actionLabel?: string;
  canDismiss?: boolean;
  startedAt?: number;
  pausedAt?: number | null;
  dismissIconColor?: string;
  extraInfo?: { dashcardIds?: DashCardId[]; tabId?: DashboardTabId } & Record<
    string,
    unknown
  >;
  _domId?: string | number;
  timeoutId: number | null;
  count?: number;
  verb?: string;
  subject?: string;
  extraAction?: {
    label: string;
    action: () => void;
  };
  ref?: RefObject<HTMLDivElement>;
}

export type UndoState = Undo[];
