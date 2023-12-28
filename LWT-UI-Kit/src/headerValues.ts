// TODO maybe have routing as its own package?

export const headerValuesTemp = {
  index: { params: [] },
  edit_texts: {
    params: [
      "chg",
      "arch",
      "page",
      "query",
      "tag1",
      "tag2",
      "tag12",
      "new",
      "sort",
    ],
  },
  edit_archivedtexts: { params: ["page", "unarch", "sort"] },
  edit_texttags: { params: ["page"] },
  edit_languages: { params: ["page"] },
  edit_words: {
    params: [
      "page",
      "status",
      "query",
      "tag12",
      "tag1",
      "chg",
      "new",
      "tag2",
      "sort",
      "text",
      "filterlang",
      "lang",
    ],
  },
  edit_tags: { params: ["query", "new", "page", "chg"] },
  statistics: { params: [] },
  check_text: { params: [] },
  new_word: { params: [] },
  do_text: { params: [] },
  do_test: { params: [] },
  long_text_import: { params: [] },
  upload_words: { params: [] },
  backup_restore: { params: [] },
  settings: { params: [] },
  info: { params: [] },
  print_text: { params: ["text", "annplcmnt", "ann", "status"] },
  print_impr_text: { params: ["text", "annplcmnt", "ann", "status"] },
  display_impr_text: { params: ["text", "annplcmnt", "ann", "status"] },
} as const;
// TODO merge into prev obj

export const headerValues = {
  Home: "index",
  Texts: "edit_texts",
  "Text Archive": "edit_archivedtexts",
  "Text Tags": "edit_texttags",
  Languages: "edit_languages",
  Terms: "edit_words",
  "Term Tags": "edit_tags",
  Statistics: "statistics",
  "Text Check": "check_text",
  "Long Text": "long_text_import",
  "Term Import": "upload_words",
  "Backup/Restore": "backup_restore",
  Settings: "settings",
  Help: "info",
} as const;
