import axios from 'axios';
import mbConfig from '../config/configFront.json';
const {MoneyButtonClient} = require('@moneybutton/api-client');
const moneyButtonKey =
  typeof window !== 'undefined' && !window.location.href.includes('localhost')
    ? mbConfig.moneybuttonProductionWallet
    : mbConfig.moneybuttonLocalhostWallet;

axios.defaults.withCredentials = true;

export default function ParseURLEncodedBody(details) {
  const formBody = [];
  for (const property in details) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(details[property]);
    formBody.push(`${encodedKey}=${encodedValue}`);
  }
  const parsed_formBody = formBody.join('&');

  return parsed_formBody;
}

export const refreshTokenHelper = async refreshToken => {
  const baseURL = 'https://www.moneybutton.com/oauth/v1/token';

  const mbClientId =
    typeof window !== 'undefined' && !window.location.href.includes('localhost')
      ? mbConfig.moneybuttonProductionWallet
      : mbConfig.moneybuttonLocalhostWallet;

  const formBody = ParseURLEncodedBody({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: mbClientId,
  });

  const raw_response = await fetch(baseURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formBody,
  });

  const response = await raw_response.json();

  return response;
};

export const AuthUser = () => {
  const mbClient = new MoneyButtonClient(moneyButtonKey);
  const moneyButtonRedirect =
    typeof window !== 'undefined' && !window.location.href.includes('localhost')
      ? 'https://indivinst.com/oauth-response-web'
      : 'http://localhost:9008/oauth-response-web';

  mbClient.requestAuthorization(
    'auth.user_identity:read users.profiles:read users.balance:read',
    moneyButtonRedirect,
  );
  mbClient.handleAuthorizationResponse();
  const refreshToken = mbClient.getRefreshToken();
  mbClient.setRefreshToken(refreshToken);
};
