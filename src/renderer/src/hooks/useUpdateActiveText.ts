import { useEffect } from 'react';
import { dataService } from '../data/data.service';
import { TextsID } from '../data/validators';
import { useData } from './useData';

export function useUpdateActiveText({ textID }: { textID: TextsID }) {
  const [{ activeTextID }] = useData(['activeTextID']);
  console.log('TEST123-SETTING-ACTIVE-OUTSIDE-EFFECT', activeTextID);
  // TODO this causes a loop?
  useEffect(() => {
    // Setting active text
    if (activeTextID !== textID) {
      console.log('TEST123-SETTING-ACTIVE', textID, activeTextID);
      dataService.setSettings({ currenttext: textID });
    }
  }, [textID + 0]);
}
