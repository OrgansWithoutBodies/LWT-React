// TODO make sure don't end in : or ' '
// TODO better pattern for plural
// TODO different plurals based on count
// TODO templating
// TODO null value just returns english
// type NonTranslatedChar=' '|'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'0'|'%'|'['|']'|'-'|'+'|'>'|'<'
// type NonTranslatedString=`${NonTranslatedChar|''}${NonTranslatedChar|''}${NonTranslatedChar|''}`
const UIStrings = [
  "Sentence\nTerm in ",
  'Study Language "L2"',
  'Study Language "L2"',
  "... AND ...",
  "Table",
  "Copy",
  "Oops!",
  "Got it!",
  "... OR ...",
  "(e.g. for Arabic, Hebrew, Farsi, Urdu, etc.)",
  "(e.g. for Chinese, Japanese, etc.)",
  "(No valid sentence)",
  "[Choose...]", // TODO dedupe
  "{count} Tag{plural}",
  "* (Set to Term)",
  "100 %", // TODO figure something out with this
  "150 %",
  "200 %",
  "&lt;&lt; Go back and correct &lt;&lt;",
  "&lt;&lt; Back",
  "Text:\n\n(max.\n65,000\nbytes)",
  "250 %",
  "404 - Page Not Found",
  "Actions",
  "All known [5+WKn]",
  "Ann.Text",
  "Annotated Text available",
  "Annotated Text",
  "Arch.\nTexts",
  "Archive",
  "Audio-URI",
  "Backup/Restore",
  "Character Substitutions",
  "Character Substitutions",
  "Check Text",
  "Choose...",
  "Choose",
  "Close Window",
  "Comment",
  "Copy → Translation & Romanization Field(s)",
  "Correct",
  "Curr.\nLang.",
  "Current Language",
  "Delete ALL Tags",
  "Delete Marked Tags",
  "Delete not possible",
  "Delete term",
  "Delete",
  "Dictionary 1 URI",
  "Dictionary 1 URI",
  "Dictionary 2 URI",
  "Dictionary 2 URI",
  "Edit Language",
  "Edit Tag",
  "Edit term",
  "Edit Term",
  "Edit Text",
  "Edit",
  "Elapsed Time",
  "Erase Text Field",
  "Exceptions Split Sentences",
  "Exceptions Split Sentences",
  "EXISTS, NOT IMPORTED",
  "Export Template",
  "Export Template",
  "Export\nTemplate?",
  "Faster",
  "Field must not be empty",
  "Field must not be empty",
  "Filter off",
  "Filter",
  "First Page",
  "Forward n seconds",
  "GoogleTranslate URI",
  "GoogleTranslate URI",
  "Help",
  "Home",
  "I know this term well",
  "Ignore this term",
  "Import Data",
  "Import Terms",
  "Important",
  "Improved Annotated Text",
  "Install LWT Demo Database",
  "Just ONE",
  "Language Settings Wizard",
  "Language",
  "Language",
  "Languages",
  "Languages",
  "Last Page",
  "Learned",
  "Learning",
  "Learning/-ed",
  "Length:\n{byteSizeOfString(TxText)}\nBytes",
  "Link to Text Source",
  "Long Text Import ...",
  "Long Text Import",
  "Long Text",
  "Lookup Sentence",
  "Make each character a word",
  "Make each character a word",
  "Mark",
  "Mark\nActions", // TODO vscode autocomplete interprets this \n as an actual return
  "Marked Tag",
  "Marked Term",
  "Marked Text",
  "Marked Texts",
  "max.\n65,000\nbytes",
  "Multi Actions",
  "My {lang} Texts",
  "My ${language.LgName} Terms (Words and Expressions)",
  "My ${language.LgName} Texts",
  "My Languages",
  "My Languages",
  "My last Text (in {LgName}):",
  "My Term Tags",
  "My Text Tags",
  "My Texts",
  "New Language ...",
  "New Language",
  "New Tag",
  "New Term Tag",
  "New Term? - Set Language Filter first ...",
  "New Term",
  "New Text ...",
  "New",
  "Newest first",
  "Next Page",
  "Next Text: {nextTitle}",
  "No Improved Annotation",
  "No tags found",
  "No",
  "Normal",
  "NOT IMPORTED (term and/or translation missing)",
  "Not yet tested",
  "Oldest first",
  "Page {currPage} of {totalPages}",
  "Page",
  "Previous Page",
  "Previous Text: {nextTitle}",
  "Print",
  "READ ▶ ${text.TxTitle}",
  "Read",
  "Refresh Media Selection",
  "RegExp Split Sentences",
  "RegExp Split Sentences",
  "RegExp Word Characters",
  "RegExp Word Characters",
  "Remove spaces",
  "Remove spaces",
  "Reparse Texts",
  "Reset All",
  "Rewind n seconds",
  "Right-To-Left Script",
  "Right-To-Left Script",
  "Romaniz.",
  "Save another translation to existent term",
  "Save translation to new term",
  "Score Value (%)",
  "Select your native (L1) and study (L2) languages, and let the wizard set all marked language settings!\n(You can adjust the settings afterwards.)",
  "Sent.",
  "Sentence\\nTerm in {'{...}'}",
  "Sentence\nTerm in {...}",
  "Sentence\nTerm in {'{...}'}",
  "Set as Current Language",
  "Settings",
  "Settings/Preferences",
  "Show Sentences",
  "Similar\nTerms",
  "Slower",
  "Sort Order",
  "Source Link available",
  "Source URI",
  "Src.Link",
  "St", // short for strength
  "Statistics",
  "Status",
  "Status",
  "Tag #1",
  "Tag #2",
  "Tag Comment A-Z",
  "Tag Comment",
  "Tag Text A-Z",
  "Tag Text or Comment",
  "Tag Text",
  "Tag",
  "Tags",
  "Term A-Z",
  "Term Import",
  "Term Tags",
  "Term, Rom., Transl. (Wildc.=*)",
  "Term",
  "Term",
  "Terms With Tag",
  "Terms",
  "Terms",
  "TEST ▶ ${text.TxTitle} (Due: {TODO} of {TODO})",
  "Test today!",
  "Test tomorrow!",
  "Test",
  "Text {ii}",
  "Text Archive",
  "Text Check",
  "Text Size",
  "Text Size",
  "Text Source",
  "Text Tags",
  "Text Title (Wildc.=*)",
  "Text",
  "Texts,\nReparse",
  "Texts",
  "This long text will be split into ${verifying.length} shorter texts - as follows:",
  "This text can fit as a single text",
  "THREE (+previous,+next)",
  "Title [Tags] / Audio",
  "Title A-Z",
  "Title",
  "Toggle Annotation Display (Now OFF)",
  "Toggle Annotation Display (Now ON)",
  "Toggle Repeat (Now OFF)",
  "Toggle Repeat (Now ON)",
  "Toggle Text Display (Now OFF)",
  "Toggle Text Display (Now ON)",
  "Translation A-Z",
  "Translation",
  "TWO (+previous)",
  "UI Language",
  "Unarchive",
  "Unknown",
  "With Audio",
  "With Improved Annotation",
  "Word Characters",
  "Word Count Active Texts",
  "Word Count in Active Texts",
  "Word",
  "Wrong",
  "Yes",
  "My Statistics",
  "Backup/Restore/Empty Database",
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
    Read: "",
    "Improved Annotated Text": "",
    New: "",
    "404 - Page Not Found": "",
    "Link to Text Source": "",
    "Annotated Text": "",
    "Text Source": "",
    "Close Window": "",
    "Toggle Text Display (Now ON)": "",
    "Toggle Text Display (Now OFF)": "",
    "Toggle Annotation Display (Now ON)": "",
    "Toggle Annotation Display (Now OFF)": "",
    Archive: "",
    "With Improved Annotation": "",
    "No Improved Annotation": "",
    "(No valid sentence)": "",
    "My ${language.LgName} Terms (Words and Expressions)": "",
    "My ${language.LgName} Texts": "",
    "Test tomorrow!": "",
    "Test today!": "",
    "Copy → Translation & Romanization Field(s)": "",
    "Word Count in Active Texts": "",
    "My Term Tags": "",
    Choose: "",
    "(e.g. for Chinese, Japanese, etc.)": "",
    "(e.g. for Arabic, Hebrew, Farsi, Urdu, etc.)": "",
    "TEST ▶ ${text.TxTitle} (Due: {TODO} of {TODO})": "",
    Wrong: "",
    Correct: "",
    "Elapsed Time": "",
    "Not yet tested": "",
    "READ ▶ ${text.TxTitle}": "",
    "New Language": "",
    "Check Text": "",
    Unknown: "",
    "Length:\n{byteSizeOfString(TxText)}\nBytes": "",
    "Edit Language": "",
    "Edit Term": "",
    "This long text will be split into ${verifying.length} shorter texts - as follows:":
      "",
    "This text can fit as a single text": "",
    "Tag #1": "",
    "Tag #2": "",
    "All known [5+WKn]": "",
    "Learning/-ed": "",
    Learning: "",
    Learned: "",
    "Similar\nTerms": "",
    "Filter off": "",
    "Term, Rom., Transl. (Wildc.=*)": "",
    "Term A-Z": "",
    "Translation A-Z": "",
    "Newest first": "",
    "Oldest first": "",
    "Score Value (%)": "",
    "Word Count Active Texts": "",
    "Sent.": "",
    "Lookup Sentence": "",
    St: "",
    Important: "",
    "Select your native (L1) and study (L2) languages, and let the wizard set all marked language settings!\n(You can adjust the settings afterwards.)":
      "",
    "Edit term": "",
    "Delete term": "",
    "I know this term well": "",
    "Ignore this term": "",
    "Reparse Texts": "",
    "Current Language": "",
    "Delete not possible": "",
    "Set as Current Language": "",
    "* (Set to Term)": "",
    "Save another translation to existent term": "",
    "Save translation to new term": "",
    "Erase Text Field": "",
    "Import Terms": "",
    "Import Data": "",
    "EXISTS, NOT IMPORTED": "",
    "NOT IMPORTED (term and/or translation missing)": "",
    "Text {ii}": "",
    Tag: "",
    "Sentence\nTerm in {'{...}'}": "",
    "New Tag": "",
    "My Text Tags": "",
    "Tag Text A-Z": "",
    "Tag Comment A-Z": "",
    "Title A-Z": "",
    "100 %": "",
    "150 %": "",
    "200 %": "",
    "250 %": "",
    Comment: "",
    "Edit Tag": "",
    "Just ONE": "",
    "TWO (+previous)": "",
    "THREE (+previous,+next)": "",
    "[Choose...]": "",
    "Choose...": "",
    "Delete Marked Tags": "",
    "Delete ALL Tags": "",
    "Marked Tag": "",
    "Marked Text": "",
    "Marked Term": "",
    "Sentence\\nTerm in {'{...}'}": "",
    "Audio-URI": "",
    "Source URI": "",
    "Word Characters": "",
    "Refresh Media Selection": "",
    "Install LWT Demo Database": "",
    "New Term Tag": "",
    "No tags found": "",
    "&lt;&lt; Go back and correct &lt;&lt;": "",
    "&lt;&lt; Back": "",
    "Text:\n\n(max.\n65,000\nbytes)": "",
    "Backup/Restore/Empty Database": "",
    "Sentence\nTerm in ": "",
    Table: "",
    "Oops!": "",
    "Got it!": "",
    "My Statistics": "",
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
    Filter: "Filtrar",
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
    Read: "",
    "Improved Annotated Text": "",
    New: "",
    "404 - Page Not Found": "",
    "Link to Text Source": "",
    "Annotated Text": "",
    "Text Source": "",
    "Close Window": "",
    "Toggle Text Display (Now ON)": "",
    "Toggle Text Display (Now OFF)": "",
    "Toggle Annotation Display (Now ON)": "",
    "Toggle Annotation Display (Now OFF)": "",
    Archive: "",
    "With Improved Annotation": "",
    "No Improved Annotation": "",
    "(No valid sentence)": "",
    "My ${language.LgName} Terms (Words and Expressions)": "",
    "My ${language.LgName} Texts": "",
    "Test tomorrow!": "",
    "Test today!": "",
    "Copy → Translation & Romanization Field(s)": "",
    "Word Count in Active Texts": "",
    "My Term Tags": "",
    Choose: "Elegir",
    "(e.g. for Chinese, Japanese, etc.)": "",
    "(e.g. for Arabic, Hebrew, Farsi, Urdu, etc.)": "",
    "TEST ▶ ${text.TxTitle} (Due: {TODO} of {TODO})": "",
    Wrong: "",
    Correct: "",
    "Elapsed Time": "",
    "Not yet tested": "",
    "READ ▶ ${text.TxTitle}": "",
    "New Language": "",
    "Check Text": "",
    Unknown: "",
    "Length:\n{byteSizeOfString(TxText)}\nBytes": "",
    "Edit Language": "",
    "Edit Term": "",
    "This long text will be split into ${verifying.length} shorter texts - as follows:":
      "",
    "This text can fit as a single text": "",
    "Tag #1": "",
    "Tag #2": "",
    "All known [5+WKn]": "",
    "Learning/-ed": "",
    Learning: "",
    Learned: "",
    "Similar\nTerms": "",
    "Filter off": "",
    "Term, Rom., Transl. (Wildc.=*)": "",
    "Term A-Z": "",
    "Translation A-Z": "",
    "Newest first": "",
    "Oldest first": "",
    "Score Value (%)": "",
    "Word Count Active Texts": "",
    "Sent.": "",
    "Lookup Sentence": "",
    St: "",
    Important: "",
    "Select your native (L1) and study (L2) languages, and let the wizard set all marked language settings!\n(You can adjust the settings afterwards.)":
      "",
    "Edit term": "",
    "Delete term": "",
    "I know this term well": "",
    "Ignore this term": "",
    "Reparse Texts": "",
    "Current Language": "",
    "Delete not possible": "",
    "Set as Current Language": "",
    "* (Set to Term)": "",
    "Save another translation to existent term": "",
    "Save translation to new term": "",
    "Erase Text Field": "",
    "Import Terms": "",
    "Import Data": "",
    "EXISTS, NOT IMPORTED": "",
    "NOT IMPORTED (term and/or translation missing)": "",
    "Text {ii}": "",
    Tag: "",
    "Sentence\nTerm in {'{...}'}": "",
    "New Tag": "",
    "My Text Tags": "",
    "Tag Text A-Z": "",
    "Tag Comment A-Z": "",
    "Title A-Z": "",
    "100 %": "",
    "150 %": "",
    "200 %": "",
    "250 %": "",
    Comment: "",
    "Edit Tag": "",
    "Just ONE": "",
    "TWO (+previous)": "",
    "THREE (+previous,+next)": "",
    "[Choose...]": "",
    "Choose...": "",
    "Delete Marked Tags": "",
    "Delete ALL Tags": "",
    "Marked Tag": "",
    "Marked Text": "",
    "Marked Term": "",
    "Sentence\\nTerm in {'{...}'}": "",
    "Audio-URI": "",
    "Source URI": "",
    "Word Characters": "",
    "Refresh Media Selection": "",
    "Install LWT Demo Database": "",
    "New Term Tag": "",
    "No tags found": "",
    "&lt;&lt; Go back and correct &lt;&lt;": "",
    "&lt;&lt; Back": "",
    "Text:\n\n(max.\n65,000\nbytes)": "",
    "Backup/Restore/Empty Database": "",
    "Sentence\nTerm in ": "",
    Table: "",
    "Oops!": "",
    "Got it!": "",
    "My Statistics": "",
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
    "... OR ...": "... AR ...",
    "... AND ...": "... IR ...",
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
    Read: "",
    "Improved Annotated Text": "",
    New: "",
    "404 - Page Not Found": "",
    "Link to Text Source": "",
    "Annotated Text": "",
    "Text Source": "",
    "Close Window": "",
    "Toggle Text Display (Now ON)": "",
    "Toggle Text Display (Now OFF)": "",
    "Toggle Annotation Display (Now ON)": "",
    "Toggle Annotation Display (Now OFF)": "",
    Archive: "",
    "With Improved Annotation": "",
    "No Improved Annotation": "",
    "(No valid sentence)": "",
    "My ${language.LgName} Terms (Words and Expressions)": "",
    "My ${language.LgName} Texts": "",
    "Test tomorrow!": "",
    "Test today!": "",
    "Copy → Translation & Romanization Field(s)": "",
    "Word Count in Active Texts": "",
    "My Term Tags": "",
    Choose: "",
    "(e.g. for Chinese, Japanese, etc.)": "",
    "(e.g. for Arabic, Hebrew, Farsi, Urdu, etc.)": "",
    "TEST ▶ ${text.TxTitle} (Due: {TODO} of {TODO})": "",
    Wrong: "",
    Correct: "",
    "Elapsed Time": "",
    "Not yet tested": "",
    "READ ▶ ${text.TxTitle}": "",
    "New Language": "",
    "Check Text": "",
    Unknown: "",
    "Length:\n{byteSizeOfString(TxText)}\nBytes": "",
    "Edit Language": "",
    "Edit Term": "",
    "This long text will be split into ${verifying.length} shorter texts - as follows:":
      "",
    "This text can fit as a single text": "",
    "Tag #1": "",
    "Tag #2": "",
    "All known [5+WKn]": "",
    "Learning/-ed": "",
    Learning: "",
    Learned: "",
    "Similar\nTerms": "",
    "Filter off": "",
    "Term, Rom., Transl. (Wildc.=*)": "",
    "Term A-Z": "",
    "Translation A-Z": "",
    "Newest first": "",
    "Oldest first": "",
    "Score Value (%)": "",
    "Word Count Active Texts": "",
    "Sent.": "",
    "Lookup Sentence": "",
    St: "",
    Important: "",
    "Select your native (L1) and study (L2) languages, and let the wizard set all marked language settings!\n(You can adjust the settings afterwards.)":
      "",
    "Edit term": "",
    "Delete term": "",
    "I know this term well": "",
    "Ignore this term": "",
    "Reparse Texts": "",
    "Current Language": "",
    "Delete not possible": "",
    "Set as Current Language": "",
    "* (Set to Term)": "",
    "Save another translation to existent term": "",
    "Save translation to new term": "",
    "Erase Text Field": "",
    "Import Terms": "",
    "Import Data": "",
    "EXISTS, NOT IMPORTED": "",
    "NOT IMPORTED (term and/or translation missing)": "",
    "Text {ii}": "",
    Tag: "",
    "Sentence\nTerm in {'{...}'}": "",
    "New Tag": "",
    "My Text Tags": "",
    "Tag Text A-Z": "",
    "Tag Comment A-Z": "",
    "Title A-Z": "",
    "100 %": "",
    "150 %": "",
    "200 %": "",
    "250 %": "",
    Comment: "",
    "Edit Tag": "",
    "Just ONE": "",
    "TWO (+previous)": "",
    "THREE (+previous,+next)": "",
    "[Choose...]": "",
    "Choose...": "",
    "Delete Marked Tags": "",
    "Delete ALL Tags": "",
    "Marked Tag": "",
    "Marked Text": "",
    "Marked Term": "",
    "Sentence\\nTerm in {'{...}'}": "",
    "Audio-URI": "",
    "Source URI": "",
    "Word Characters": "",
    "Refresh Media Selection": "",
    "Install LWT Demo Database": "",
    "New Term Tag": "",
    "No tags found": "",
    "&lt;&lt; Go back and correct &lt;&lt;": "",
    "&lt;&lt; Back": "",
    "Text:\n\n(max.\n65,000\nbytes)": "",
    "Backup/Restore/Empty Database": "",
    "Sentence\nTerm in ": "",
    Table: "",
    "Oops!": "",
    "Got it!": "",
    "My Statistics": "",
  },
  // 'Mandarin Chinese (Simplified)': undefined,
  // 'Arabic (Levantine)': undefined,
};