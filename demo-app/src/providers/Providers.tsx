import { AuthProvider, Storage } from '@asgardeo/auth-react';
import { TokenExchangePlugin } from '@asgardeo/token-exchange-plugin';

interface Props {
  children: JSX.Element;
}

const config = {
  signInRedirectURL: "http://localhost:3000",
  signOutRedirectURL: "http://localhost:3000",
  clientID: "AASVmRUB48lW_MehmiJzDB7rvaEa",
  baseUrl: "https://dev.api.asgardeo.io/t/sujandev",
  scope: [ "openid","profile" ],
  resourceServerURLs: [ "http://localhost:9090", "https://run.mocky.io/v3/", "https://api.authz.choreoapps.dev", "https://sts.preview-dv.choreo.dev/", "https://appv2.preview-dv.choreo.dev/" ],
  stsConfig: {
    client_id: "OgZinFqTqK1EsIxSM_UOxYfkehoa",
    scope: [],
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
