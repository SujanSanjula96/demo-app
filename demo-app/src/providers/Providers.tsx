import { AuthProvider, Storage } from '@asgardeo/auth-react';
import { TokenExchangePlugin } from '@asgardeo/token-exchange-plugin';
import { apiUrl } from '../config';

interface Props {
  children: JSX.Element;
}

const config = {
  signInRedirectURL: "http://localhost:3001",
  signOutRedirectURL: "http://localhost:3001",
  clientID: "UT8dq9f85ZTrD4LUkaeE6tceHQAa",
  baseUrl: "https://dev.api.asgardeo.io/t/starkindustries",
  scope: [ "openid","profile", "groups" ],
  resourceServerURLs: [ "https://sts.preview-dv.choreo.dev/", apiUrl ],
  stsConfig: {
    client_id: "4USSoh7kwOEvk3F29o_dkHtfTGYa",
    scope: ["urn:starkindustries:issueapi:create_issue", "urn:starkindustries:issueapi:list_issues", "urn:starkindustries:issueapi:close_issue"],
    orgHandle: "starkindustries"
  },
  stsTokenEndpoint: "https://sts.preview-dv.choreo.dev/oauth2/token"
};

export default function Providers({ children }: Props) {

  return (
    <AuthProvider
      config={ config }
      plugin={ TokenExchangePlugin.getInstance() }
    >
        {children}
    </AuthProvider>
  );
}
