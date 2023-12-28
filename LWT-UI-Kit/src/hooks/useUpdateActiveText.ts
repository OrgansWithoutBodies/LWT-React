import { TextsID } from "lwt-schemas";
import { dataService, useData } from "lwt-state";
import { useEffect } from "react";

export function useUpdateActiveText({ textID }: { textID: TextsID }) {
  const [{ activeTextID }] = useData(["activeTextID"]);
  useEffect(() => {
    // our current useData hook has a behavior where queries are sometimes undefined at first regardless of actual state - prevent this from triggering every single initial val
    console.log("TEST123-SETTING-ACTIVE", textID, activeTextID);
    if (activeTextID !== textID && activeTextID !== undefined) {
      console.log("TEST123-SETTING-ACTIVE", textID, activeTextID);
      dataService.setSettings({ currenttext: textID });
    }
  }, [textID, activeTextID]);
}
