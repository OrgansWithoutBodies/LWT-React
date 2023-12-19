import { Word } from '../utils/parseMySqlDump';

// TODO these enums are different per select
export const enum WordSorting {
  'Term A-Z' = 1,
  'Translation A-Z' = 2,
  'Term Z-A' = 8,
  'Translation Z-A' = 9,
  'Newest first' = 3,
  'Oldest first' = 7,
  'Status' = 4,
  'Score Value (%)' = 5,
  'Score Value (%) (desc)' = 10,
  'Word Count Active Texts (desc)' = 11,
  'Word Count Active Texts' = 6,
  'Stat./Days' = 12,
  'Stat./Days (desc)' = 13,
  'Lang.' = 14,
  'Lang. (desc)' = 15,
}
export const enum TextSorting {
  'Title A-Z' = 1,
  'Newest first' = 2,
  'Oldest first' = 3,
  'Title Z-A' = 4,
  'Total Words' = 5,
  'Total Words (desc)' = 10,
  'Saved Wo+Ex' = 6,
  'Unkn. Words' = 7,
  'Unkn. %' = 8,
  // TODO incl in library
  'Lang.' = 9,
  'Saved Wo+Ex (desc)' = 13,
  'Unkn. Words (desc)' = 11,
  'Unkn. % (desc)' = 14,
  'Lang. (desc)' = 12,
}

// TODO formally encode reverse sorting - mul code by -1 = mul result by -1?
export const enum TagSorting {
  'Tag Text A-Z' = 1,
  'Tag Text Z-A' = 5,
  'Tag Comment A-Z' = 2,
  'Tag Comment Z-A' = 6,
  'Newest first' = 3,
  'Oldest first' = 4,
  'Terms With Tag' = 7,
  'Terms With Tag (desc)' = 8,
  'Texts With Tag' = 9,
  'Texts With Tag (desc)' = 10,
  'Arch. Texts With Tag' = 11,
  'Arch. Texts With Tag (desc)' = 12,
  'Term Count' = 13,
  'Term Count (desc)' = 14,
} // sorts = array('WoTextLC', 'lower(WoTranslation)', 'WoID desc', 'WoStatus, WoTextLC', 'WoTodayScore', 'textswordcount desc, WoTextLC asc', 'WoID');
export const enum LanguageSorting {
  'Language A-Z' = 1,
  'Language Z-A' = 2,
  'Num Texts' = 3,
  'Num Texts (desc)' = 4,
  'Num Terms' = 5,
  'Num Terms (desc)' = 6,
  'Num Archived Texts' = 7,
  'Num Archived Texts (desc)' = 8,
}

export const sortingMethod = (
  sort: WordSorting
): ((termA: Word, termB: Word) => 1 | -1 | 0) => {
  switch (sort) {
    case WordSorting['Oldest first']:
      return buildSortByOldest('WoCreated');
    case WordSorting['Newest first']:
      return buildSortByNewest('WoCreated');
    case WordSorting['Score Value (%)']:
      return buildSortByValue('WoTodayScore', false);
    case WordSorting['Score Value (%) (desc)']:
      return buildSortByValue('WoTodayScore');
    case WordSorting.Status:
      return buildSortByValue('WoStatus', false);
    case WordSorting['Term A-Z']:
      return buildSortByValue('WoText', false);
    case WordSorting['Term Z-A']:
      return buildSortByValue('WoText', true);
    case WordSorting['Stat./Days']:
      // TODO
      return buildSortByValue('WoTranslation', false);
    case WordSorting['Stat./Days (desc)']:
      // TODO
      return buildSortByValue('WoTranslation', false);
    case WordSorting['Lang.']:
      // TODO
      return buildSortByValue('WoTranslation', false);
    case WordSorting['Lang. (desc)']:
      // TODO
      return buildSortByValue('WoTranslation', false);
    case WordSorting['Translation A-Z']:
      return buildSortByValue('WoTranslation', false);
    case WordSorting['Translation Z-A']:
      return buildSortByValue('WoTranslation', true);
    // TODO
    case WordSorting['Word Count Active Texts']:
      return (a, b) =>
        a.WoCreated > b.WoCreated ? -1 : a.WoCreated < b.WoCreated ? 1 : 0;
    case WordSorting['Word Count Active Texts (desc)']:
      return (a, b) =>
        a.WoCreated > b.WoCreated ? -1 : a.WoCreated < b.WoCreated ? 1 : 0;
  }
};
/**
 *
 * @param key
 */
export function buildSortByNewest<
  TKey extends string,
  TObj extends Record<TKey, string>
>(key: TKey) {
  return ({ [key]: a }: TObj, { [key]: b }: TObj): 1 | -1 | 0 =>
    Date.parse(a) > Date.parse(b) ? -1 : Date.parse(a) < Date.parse(b) ? 1 : 0;
}
/**
 *
 * @param key
 */
export function buildSortByOldest<
  TKey extends string,
  TObj extends Record<TKey, string>
>(key: TKey) {
  return ({ [key]: a }: TObj, { [key]: b }: TObj): 1 | -1 | 0 =>
    Date.parse(a) > Date.parse(b) ? 1 : Date.parse(a) < Date.parse(b) ? -1 : 0;
}
/**
 * TODO ugly
 * @param key
 * @param asc
 */
export function buildSortByValue<
  TKey extends string,
  TObj extends Record<TKey, any>
>(key: TKey, asc = true) {
  const ascFac = asc ? 1 : -1;
  return ({ [key]: a }: TObj, { [key]: b }: TObj): 1 | -1 | 0 =>
    (a > b ? ascFac * 1 : a < b ? ascFac * -1 : 0) as 0 | 1 | -1;
}
