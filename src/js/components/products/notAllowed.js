// @flow

import * as React from 'react';
import Illustration from '@salesforce/design-system-react/components/illustration';
import { Trans } from 'react-i18next';
import { t } from 'i18next';

import Login from 'components/header/login';

import svgPath from 'images/no-access.svg';

const NotAllowed = ({
  isLoggedIn,
  message,
  link,
}: {
  isLoggedIn: boolean,
  message: string | null,
  link: React.Node,
}) => (
  <>
    <Illustration
      heading={t('Restricted Access')}
      name="No Access"
      path={`${svgPath}#no-access`}
      size="large"
    />
    {message ? (
      <div className="slds-align_absolute-center">
        <div
          className="slds-text-longform slds-text-body_regular"
          // This message is pre-cleaned by the API
          dangerouslySetInnerHTML={{
            __html: message,
          }}
        />
      </div>
    ) : null}
    <div className="slds-align_absolute-center">
      <div className="slds-text-longform slds-text-body_regular">
        <Trans i18nKey="notAllowedLink">{link} or&nbsp;</Trans>
      </div>
      <Login
        id="product-not-allowed-login"
        label={isLoggedIn ? t('log in with a different org') : t('log in')}
        buttonClassName="slds-p-horizontal_xxx-small"
        buttonVariant="base"
      />
    </div>
  </>
);

export default NotAllowed;
