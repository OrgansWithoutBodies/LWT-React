import { useEffect } from 'react';
import { dataService } from '../data/data.service';
import { TextsID } from '../data/validators';

export function useUpdateActiveText(textID: TextsID) {
  useEffect(() => {
    // Setting active text
    dataService.setSettings({ currenttext: textID });
  }, [textID]);
}
