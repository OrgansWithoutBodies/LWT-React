// TODO make sure don't end in : or ' '
// TODO better pattern for plural
// TODO different plurals based on count
// TODO templating
// TODO null value just returns english
const UIStrings = [
  "Actions",
  "New Term? - Set Language Filter first ...",
  // TODO vscode autocomplete interprets this \n as an actual return
  "Mark\nActions",
  "Language Settings Wizard",
  "Language",
  "Edit Text",
  "New Term",
  "Next Text: {nextTitle}",
  "Previous Text: {nextTitle}",
  "Print",
  "Normal",
  "Faster",
  "Slower",
  "Read",
  "Improved Annotated Text",
  "Forward n seconds",
  "Rewind n seconds",
  "Toggle Repeat (Now OFF)",
  "Toggle Repeat (Now ON)",
  "Languages",
  "Long Text Import",
  "Curr.\nLang.",
  "Terms",
  "Term",
  "Show Sentences",
  "My last Text (in {LgName}):",
  "{count} Tag{plural}",
  "Word",
  "Text",
  "Unarchive",
  "Delete",
  "Edit",
  "Mark",
  "Annotated Text available",
  "Tag Text",
  "Tag Comment",
  "Terms With Tag",
  "max.\n65,000\nbytes",
  "Tag Text or Comment",
  "Marked Texts",
  "Title [Tags] / Audio",
  "Title",
  "UI Language",
  "With Audio",
  "Src.Link",
  "Source Link available",
  "Ann.Text",
  "My Texts",
  "New Text ...",
  "Long Text Import ...",
  "My {lang} Texts",
  "Page",
  "Yes",
  "No",
  "Sort Order",
  "Text Title (Wildc.=*)",
  "Filter",
  "... OR ...",
  "... AND ...",
  "Page {currPage} of {totalPages}",
  "Test",
  "Arch.\nTexts",
  "Multi Actions",
  "My Languages",
  "My Languages",
  "Home",
  "Texts",
  "Text Archive",
  "Text Tags",
  "Languages",
  "Terms",
  "Term Tags",
  "Statistics",
  "Text Check",
  "Long Text",
  "Term Import",
  "Backup/Restore",
  "Reset All",
  "Settings",
  "Settings/Preferences",
  "Help",
  "New Language ...",
  "Export\nTemplate?",
  "Texts,\nReparse",
  'Study Language "L2"',
  "Dictionary 1 URI",
  "Dictionary 2 URI",
  "GoogleTranslate URI",
  "Text Size",
  "Character Substitutions",
  "RegExp Split Sentences",
  "Exceptions Split Sentences",
  "RegExp Word Characters",
  "Make each character a word",
  "Remove spaces",
  "Right-To-Left Script",
  "Export Template",
  "Language",
  "Term",
  "Translation",
  "Tags",
  "Romaniz.",
  "Sentence\nTerm in {...}",
  "Status",
  "Last Page",
  "Next Page",
  "Previous Page",
  "First Page",
  "Field must not be empty",
] as const;
export type UIString = (typeof UIStrings)[number];
// TODO tie these to a LgID? - could even use terms in db as source for these?
export const I18NLanguages = [
  "English",
  "German",
  "Spanish",
  "Lithuanian",
  // 'Mandarin Chinese (Simplified)',
  // 'Arabic (Levantine)',
] as const;
export type SuppportedI18NLanguages = (typeof I18NLanguages)[number];
const EnglishUILookup: Record<UIString, string> = Object.fromEntries(
  UIStrings.map((val) => [val, val] as const)
  // TODO no cast
) as Record<UIString, string>;
export const i18NLanguageLookups: Record<
  SuppportedI18NLanguages,
  Record<UIString, string>
> = {
  English: EnglishUILookup,
  German: {
    "Curr.\nLang.": "Aktuelle\nSprache",
    Test: "Prüfen",
    Actions: "Aktionen",
    Language: "Sprache",
    Languages: "Sprachen",
    "Arch.\nTexts": "Arch.\nTexte",
    Terms: "Begriffe",
    "Mark\nActions": "",
    "Long Text Import": "",
    Term: "Begriff",
    "{count} Tag{plural}": "",
    Word: "",
    Text: "",
    Mark: "",
    "Tag Text": "",
    "Tag Comment": "",
    "Terms With Tag": "",
    "Tag Text or Comment": "",
    "Marked Texts": "",
    "Title [Tags] / Audio": "",
    Title: "",
    "With Audio": "",
    "Src.Link": "",
    "Source Link available": "",
    "Ann.Text": "",
    "My Texts": "",
    "New Text ...": "",
    "Long Text Import ...": "",
    "My {lang} Texts": "",
    Page: "",
    Yes: "",
    No: "",
    "Sort Order": "",
    "Text Title (Wildc.=*)": "",
    Filter: "",
    "... OR ...": "",
    "... AND ...": "",
    "Page {currPage} of {totalPages}": "",
    "Multi Actions": "",
    "My Languages": "Meine Sprachen",
    "Export\nTemplate?": "Export\nVorlage?",
    "New Language ...": "Neue Sprache ...",
    "Texts,\nReparse": "Wieder\nAnalysieren",
    Home: "Anfang",
    Texts: "Texte",
    "Text Archive": "",
    "Text Tags": "",
    "Term Tags": "",
    Statistics: "",
    "Text Check": "Prüfen Texte",
    "Long Text": "",
    "Term Import": "",
    "Backup/Restore": "",
    Settings: "Einstellungen",
    Help: "Hilfe",
    "UI Language": "UI Sprache",
    "Settings/Preferences": "Einstellungen/Vorlieben",
    "New Term? - Set Language Filter first ...": "",
    Unarchive: "",
    Delete: "",
    Edit: "",
    "Annotated Text available": "",
    "max.\n65,000\nbytes": "",
    "Reset All": "",
    "My last Text (in {LgName}):": "",
    'Study Language "L2"': "",
    "Dictionary 1 URI": "",
    "Dictionary 2 URI": "",
    "GoogleTranslate URI": "",
    "Text Size": "",
    "Character Substitutions": "",
    "RegExp Split Sentences": "",
    "Exceptions Split Sentences": "",
    "RegExp Word Characters": "",
    "Make each character a word": "",
    "Remove spaces": "",
    "Right-To-Left Script": "",
    "Export Template": "",
    Translation: "",
    Tags: "",
    "Romaniz.": "",
    "Sentence\nTerm in {...}": "",
    Status: "",
    "Show Sentences": "",
    "Edit Text": "",
    "New Term": "",
    Print: "",
    Normal: "",
    Faster: "",
    Slower: "",
    "Forward n seconds": "",
    "Rewind n seconds": "",
    "Toggle Repeat (Now OFF)": "",
    "Toggle Repeat (Now ON)": "",
    "Last Page": "",
    "Next Page": "",
    "Previous Page": "",
    "First Page": "",
    "Field must not be empty": "",
    "Next Text: {nextTitle}": "",
    "Previous Text: {nextTitle}": "",
    "Language Settings Wizard": "",
  },
  Spanish: {
    Actions: "",
    "Mark\nActions": "",
    Language: "Idioma",
    Languages: "Idiomas",
    "Long Text Import": "",
    "Curr.\nLang.": "",
    Terms: "Terminas",
    Term: "Termina",
    "{count} Tag{plural}": "",
    Word: "Palabra",
    Text: "Texte",
    Mark: "Marque",
    "Tag Text": "",
    "Tag Comment": "",
    "Terms With Tag": "",
    "Tag Text or Comment": "",
    "Marked Texts": "",
    "Title [Tags] / Audio": "",
    Title: "",
    "UI Language": "Idioma del IU",
    "With Audio": "",
    "Src.Link": "",
    "Source Link available": "",
    "Ann.Text": "",
    "My Texts": "",
    "New Text ...": "",
    "Long Text Import ...": "",
    "My {lang} Texts": "",
    Page: "Pagina",
    Yes: "Si",
    No: "No",
    "Sort Order": "",
    "Text Title (Wildc.=*)": "",
    Filter: "",
    "... OR ...": "... Y ...",
    "... AND ...": "... O ...",
    // TODO templating
    "Page {currPage} of {totalPages}": "",
    Test: "Pruébate",
    "Arch.\nTexts": "",
    "Multi Actions": "",
    "My Languages": "Mis Idiomas",
    Home: "Inicio",
    Texts: "",
    "Text Archive": "",
    "Text Tags": "",
    "Term Tags": "",
    Statistics: "",
    "Text Check": "",
    "Long Text": "",
    "Term Import": "",
    "Backup/Restore": "",
    Settings: "",
    Help: "Ayudame",
    "New Language ...": "",
    "Export\nTemplate?": "",
    "Texts,\nReparse": "",
    "Settings/Preferences": "",
    "New Term? - Set Language Filter first ...": "",
    Unarchive: "",
    Delete: "",
    Edit: "",
    "Annotated Text available": "",
    "max.\n65,000\nbytes": "",
    "Reset All": "",
    "My last Text (in {LgName}):": "",
    'Study Language "L2"': "",
    "Dictionary 1 URI": "",
    "Dictionary 2 URI": "",
    "GoogleTranslate URI": "",
    "Text Size": "",
    "Character Substitutions": "",
    "RegExp Split Sentences": "",
    "Exceptions Split Sentences": "",
    "RegExp Word Characters": "",
    "Make each character a word": "",
    "Remove spaces": "",
    "Right-To-Left Script": "",
    "Export Template": "",
    Translation: "",
    Tags: "",
    "Romaniz.": "",
    "Sentence\nTerm in {...}": "",
    Status: "",
    "Show Sentences": "",
    "Edit Text": "",
    "New Term": "",
    Print: "",
    Normal: "",
    Faster: "",
    Slower: "",
    "Forward n seconds": "",
    "Rewind n seconds": "",
    "Toggle Repeat (Now OFF)": "",
    "Toggle Repeat (Now ON)": "",
    "Last Page": "",
    "Next Page": "",
    "Previous Page": "",
    "First Page": "",
    "Field must not be empty": "",
    "Next Text: {nextTitle}": "",
    "Previous Text: {nextTitle}": "",
    "Language Settings Wizard": "",
  },
  Lithuanian: {
    Actions: "",
    "New Term? - Set Language Filter first ...": "",
    "Mark\nActions": "",
    Language: "Kalba",
    Languages: "Kalbai",
    "Long Text Import": "",
    "Curr.\nLang.": "",
    Terms: "",
    Term: "",
    "{count} Tag{plural}": "",
    Word: "",
    Text: "",
    Unarchive: "",
    Delete: "",
    Edit: "",
    Mark: "",
    "Annotated Text available": "",
    "Tag Text": "",
    "Tag Comment": "",
    "Terms With Tag": "",
    "max.\n65,000\nbytes": "",
    "Tag Text or Comment": "",
    "Marked Texts": "",
    "Title [Tags] / Audio": "",
    Title: "",
    "UI Language": "",
    "With Audio": "",
    "Src.Link": "",
    "Source Link available": "",
    "Ann.Text": "",
    "My Texts": "",
    "New Text ...": "",
    "Long Text Import ...": "",
    "My {lang} Texts": "",
    Page: "",
    Yes: "",
    No: "",
    "Sort Order": "",
    "Text Title (Wildc.=*)": "",
    Filter: "",
    "... OR ...": "",
    "... AND ...": "",
    "Page {currPage} of {totalPages}": "",
    Test: "",
    "Arch.\nTexts": "",
    "Multi Actions": "",
    "My Languages": "",
    Home: "",
    Texts: "",
    "Text Archive": "",
    "Text Tags": "",
    "Term Tags": "",
    Statistics: "",
    "Text Check": "",
    "Long Text": "",
    "Term Import": "",
    "Backup/Restore": "",
    "Reset All": "",
    Settings: "",
    "Settings/Preferences": "",
    Help: "",
    "New Language ...": "",
    "Export\nTemplate?": "",
    "Texts,\nReparse": "",
    "My last Text (in {LgName}):": "",
    'Study Language "L2"': "",
    "Dictionary 1 URI": "",
    "Dictionary 2 URI": "",
    "GoogleTranslate URI": "",
    "Text Size": "",
    "Character Substitutions": "",
    "RegExp Split Sentences": "",
    "Exceptions Split Sentences": "",
    "RegExp Word Characters": "",
    "Make each character a word": "",
    "Remove spaces": "",
    "Right-To-Left Script": "",
    "Export Template": "",
    Translation: "",
    Tags: "",
    "Romaniz.": "",
    "Sentence\nTerm in {...}": "",
    Status: "",
    "Show Sentences": "",
    "Edit Text": "",
    "New Term": "",
    Print: "",
    Normal: "",
    Faster: "",
    Slower: "",
    "Forward n seconds": "",
    "Rewind n seconds": "",
    "Toggle Repeat (Now OFF)": "",
    "Toggle Repeat (Now ON)": "",
    "Last Page": "",
    "Next Page": "",
    "Previous Page": "",
    "First Page": "",
    "Field must not be empty": "",
    "Next Text: {nextTitle}": "",
    "Previous Text: {nextTitle}": "",
    "Language Settings Wizard": "",
  },
  // 'Mandarin Chinese (Simplified)': undefined,
  // 'Arabic (Levantine)': undefined,
};
