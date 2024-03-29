import { TextsID } from "lwt-schemas";
import { dataService, useData } from "lwt-state";
import { useEffect } from "react";

export function useUpdateActiveText({ txID: txID }: { txID: TextsID }) {
  const [{ activeTextID }] = useData(["activeTextID"]);
  useEffect(() => {
    // our current useData hook has a behavior where queries are sometimes undefined at first regardless of actual state - prevent this from triggering every single initial val

    if (activeTextID !== txID && activeTextID !== undefined) {
      dataService.setSettings({ currenttext: txID });
    }
  }, [txID, activeTextID]);
}
