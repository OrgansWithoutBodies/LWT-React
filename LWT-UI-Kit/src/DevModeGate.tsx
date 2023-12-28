import { PropsWithChildren } from "react";
import { useAppContext } from "../../LWT-Build/src/useContext";

/**
 * Only render children when in devMode otherwise render nothing
 * for testing experimental features
 */
export function DevModeGate({ children }: PropsWithChildren<object>) {
  const { devMode } = useAppContext();
  return <>{devMode ? children : <></>}</>;
}
