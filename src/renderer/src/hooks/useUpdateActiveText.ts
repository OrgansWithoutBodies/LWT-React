import { useEffect } from 'react';
import { dataService } from '../data/data.service';
import { TextsId } from '../data/validators';

export function useUpdateActiveText(textID: TextsId) {
  useEffect(() => {
    // Setting active text
    dataService.setSettings({ currenttext: textID });
  }, [textID]);
}
