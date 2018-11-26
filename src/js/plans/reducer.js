// @flow

import type { LogoutAction } from 'accounts/actions';
import type { PlansAction } from 'plans/actions';

export type Step = {|
  +id: string,
  +name: string,
  +kind: string,
  +kind_icon: string | null,
  +is_required: boolean,
  +is_recommended: boolean,
  +description: string,
|};
export type Plan = {
  +id: string,
  +slug: string,
  +title: string,
  +preflight_message: string,
  +steps: Array<Step>,
};
export type Plans = Array<Plan>;

export type PreflightError = {|
  +status: 'warn' | 'error' | 'skip' | 'optional',
  +message?: string,
|};
export type PreflightErrors = {|
  +plan?: Array<PreflightError>,
  [string]: Array<PreflightError>,
|};
export type Preflight = {|
  +id: string | null,
  +plan: string,
  +status: 'started' | 'complete' | 'failed',
  +results: PreflightErrors,
  +is_valid: boolean,
  +error_count: number,
  +warning_count: number,
  +is_ready: boolean,
|};
export type PreflightsState = {
  [string]: Preflight,
};

export const CONSTANTS = {
  STATUS: {
    STARTED: 'started',
    COMPLETE: 'complete',
    FAILED: 'failed',
  },
  RESULT_STATUS: {
    WARN: 'warn',
    ERROR: 'error',
    SKIP: 'skip',
    OPTIONAL: 'optional',
  },
};

const reducer = (
  preflights: PreflightsState = {},
  action: PlansAction | LogoutAction,
): PreflightsState => {
  switch (action.type) {
    case 'USER_LOGGED_OUT':
      return {};
    case 'FETCH_PREFLIGHT_SUCCEEDED': {
      const { plan, preflight } = action.payload;
      return { ...preflights, [plan]: preflight };
    }
    case 'PREFLIGHT_STARTED': {
      const plan = action.payload;
      return {
        ...preflights,
        [plan]: {
          id: null,
          plan,
          status: CONSTANTS.STATUS.STARTED,
          results: {},
          is_valid: true,
          error_count: 0,
          warning_count: 0,
          is_ready: false,
        },
      };
    }
    case 'PREFLIGHT_COMPLETED':
    case 'PREFLIGHT_FAILED': {
      const preflight = action.payload;
      const { plan } = preflight;
      return { ...preflights, [plan]: preflight };
    }
    case 'PREFLIGHT_INVALIDATED': {
      const preflight = action.payload;
      const { plan } = preflight;
      const existingPreflight = preflights[plan];
      if (!existingPreflight) {
        return { ...preflights, [plan]: preflight };
      }
      return {
        ...preflights,
        [plan]: {
          ...existingPreflight,
          is_valid: false,
        },
      };
    }
  }
  return preflights;
};

export default reducer;
