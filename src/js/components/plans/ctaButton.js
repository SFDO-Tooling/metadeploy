// @flow

import * as React from 'react';
import Button from '@salesforce/design-system-react/components/button';
import Spinner from '@salesforce/design-system-react/components/spinner';

import { CONSTANTS } from 'plans/reducer';

import Login from 'components/header/login';

import type {
  Plan as PlanType,
  Preflight as PreflightType,
} from 'plans/reducer';
import type { User as UserType } from 'accounts/reducer';
import typeof {
  fetchPreflight as FetchPreflightType,
  startPreflight as StartPreflightType,
} from 'plans/actions';

const { STATUS } = CONSTANTS;
const btnClasses = 'slds-size_full slds-p-vertical_xx-small';

// For use as a "loading" button label
const LabelWithSpinner = ({ label }: { label: string }): React.Node => (
  <>
    <span className="slds-is-relative slds-m-right_large">
      <Spinner variant="inverse" size="small" />
    </span>
    {label}
  </>
);

// Generic "login" dropdown with custom label text
const LoginBtn = ({ label }: { label: string }): React.Node => (
  <Login
    id="plan-detail-login"
    buttonClassName={btnClasses}
    buttonVariant="brand"
    triggerClassName="slds-size_full"
    label={label}
  />
);

// Primary CTA button
const ActionBtn = ({
  label,
  disabled,
  onClick,
}: {
  label: string | React.Node,
  disabled?: boolean,
  onClick?: () => void,
}): React.Node => (
  <Button
    className={btnClasses}
    label={label}
    variant="brand"
    onClick={onClick}
    disabled={disabled}
  />
);

class CtaButton extends React.Component<{
  user: UserType,
  plan: PlanType,
  preflight: ?PreflightType,
  doFetchPreflight: FetchPreflightType,
  doStartPreflight: StartPreflightType,
}> {
  // Returns an action btn if logged in with a valid token;
  // otherwise returns a login dropdown
  getLoginOrActionBtn(label: string, onClick?: () => void): React.Node {
    const { user } = this.props;
    const hasValidToken = user && user.valid_token_for !== null;
    if (hasValidToken) {
      return <ActionBtn label={label} onClick={onClick} />;
    }
    // Require login first...
    return <LoginBtn label={`Log In to ${label}`} />;
  }

  render(): React.Node {
    const {
      user,
      plan,
      preflight,
      doFetchPreflight,
      doStartPreflight,
    } = this.props;
    if (!user) {
      // Require login first...
      return <LoginBtn label="Log In to Start Pre-Install Validation" />;
    }

    // An `undefined` preflight means we don't know whether a preflight exists
    if (preflight === undefined) {
      // Fetch most recent preflight result (if any exists)
      doFetchPreflight(plan.id);
      return (
        <ActionBtn label={<LabelWithSpinner label="Loading..." />} disabled />
      );
    }

    const startPreflight = () => {
      doStartPreflight(plan.id);
    };
    // A `null` preflight means we already fetched and no prior preflight exists
    if (preflight === null) {
      // No prior preflight exists
      return this.getLoginOrActionBtn(
        'Start Pre-Install Validation',
        startPreflight,
      );
    }

    switch (preflight.status) {
      case STATUS.STARTED: {
        // Preflight in progress...
        return (
          <ActionBtn
            label={
              <LabelWithSpinner label="Pre-Install Validation In Progress..." />
            }
            disabled
          />
        );
      }
      case STATUS.COMPLETE: {
        if (preflight.is_ready) {
          // Preflight is done, valid, and has no errors -- allow installation
          return this.getLoginOrActionBtn('Install');
        }
        // Prior preflight exists, but is no longer valid or has errors
        return this.getLoginOrActionBtn(
          'Re-Run Pre-Install Validation',
          startPreflight,
        );
      }
      case STATUS.FAILED: {
        // Prior preflight exists, but failed or had plan-level errors
        return this.getLoginOrActionBtn(
          'Re-Run Pre-Install Validation',
          startPreflight,
        );
      }
    }
    return null;
  }
}

export default CtaButton;
