import { useState, useEffect, useMemo } from "react";
import { FrontId, usePermissions, ResetPermissions } from "./components/OnBoarding";
import incode from './incode';

export function useQuery() {
  return useMemo(() => new URLSearchParams(window.location.search), []);
}

function App() {
  const [session, setSession] = useState();
  const permissionsState = usePermissions();
  const [resetPermissions, setResetPermissions] = useState(false);

  const queryParams = useQuery();
  useEffect(() => {
    const flowId = queryParams.get("flowId");
    incode
      .createSession("ALL", null, {
        configurationId: flowId,
      })
      .then(async (session) => {
        await incode.warmup();
        setSession(session);
        console.log(session);
      });
  }, [queryParams]);

  useEffect(() => {
    // if permissions are denied from start, let's show the reset permissions screen
    setResetPermissions(permissionsState === "denied" ? true : false);
  }, [permissionsState]);

  if (!session) return "loading";
  if (resetPermissions) {
    return <ResetPermissions onTryAgain={() => setResetPermissions(false)} />;
  }
  return (
    <div className="App">
      <h1>{session.interviewId}</h1>
      <FrontId session={session} onError={(e)=>console.log(e)} onSuccess={(s)=>console.log(s)}/>
    </div>
  );
}

export default App;
