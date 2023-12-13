// TODO - maybe save in context? handle in form?
export const resetDirty = () => {
  // TODO
  // ** You have unsaved changes! **
};
export const setDirty = () => {};

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

// TODO formally encode reverse sorting
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
}
