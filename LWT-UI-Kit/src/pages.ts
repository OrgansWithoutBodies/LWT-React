import { InternalPaths } from "./hooks/useInternalNav";

export const linkLayout: ({ link: InternalPaths; label: string } | null)[] = [
  { link: "/edit_texts", label: "My Texts" },
  { link: "/edit_archivedtexts", label: "My Text Archive" },
  { link: "/edit_texttags", label: "My Text Tags" },
  { link: "/edit_languages", label: "My Languages" },
  null,
  { link: "/edit_words", label: "My Terms (Words and Expressions)" },
  { link: "/edit_tags", label: "My Term Tags" },
  null,
  { link: "/statistics", label: "My Statistics" },
  null,
  { link: "/check_text", label: "Check a Text" },
  { link: "/long_text_import", label: "Long Text Import" },
  { link: "/upload_words", label: "Import Terms" },
  { link: "/backup_restore", label: "Backup/Restore/Empty Database" },
  null,
  { link: "/settings", label: "Settings/Preferences" },
  null,
  { link: "/info", label: "Help/Information" },
  // TODO?
  // { link: '/mobile', label: 'Mobile LWT (Experimental)' },
  // TODO typing
  //   ...(pluginLinks as any),
];
