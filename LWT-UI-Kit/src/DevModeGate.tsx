import { useAppContext } from "lwt-build";
import { PropsWithChildren } from "react";

/**
 * Only render children when in devMode otherwise render nothing
 * for testing experimental features
 */
export function DevModeGate({ children }: PropsWithChildren<object>) {
  const { devMode } = useAppContext();
  return <>{devMode ? children : <></>}</>;
}
