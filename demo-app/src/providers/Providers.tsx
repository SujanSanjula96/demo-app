import { AuthProvider, Storage } from '@asgardeo/auth-react';
import { TokenExchangePlugin } from '@asgardeo/token-exchange-plugin';

interface Props {
  children: JSX.Element;
}

const config = {
  signInRedirectURL: "http://localhost:3001",
  signOutRedirectURL: "http://localhost:3001",
  clientID: "AASVmRUB48lW_MehmiJzDB7rvaEa",
  baseUrl: "https://dev.api.asgardeo.io/t/sujandev",
  scope: [ "openid","profile", "groups" ],
  resourceServerURLs: [ "http://localhost:9090", "https://7f092d26-d233-4e7d-b0da-1a23893c68da-dev.e1-us-east-azure.preview-dv.choreoapis.dev/", "https://7f092d26-d233-4e7d-b0da-1a23893c68da-prod.e1-us-east-azure.preview-dv.choreoapis.dev", "https://sts.preview-dv.choreo.dev/", "https://7f092d26-d233-4e7d-b0da-1a23893c68da-prod.e1-us-east-azure.preview-dv.choreoapis.dev" ],
  stsConfig: {
    client_id: "OgZinFqTqK1EsIxSM_UOxYfkehoa",
    scope: ["urn:sujandev:issuemanagem:closeIssue"],
    orgHandle: "sujandev"
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
