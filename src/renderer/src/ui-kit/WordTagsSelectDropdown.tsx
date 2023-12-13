import { WordsId } from '../data/validators';
import { useData } from '../hooks/useAkita';

/**
 *
 */
export function WordTagsSelectDropdown({ wordID }: { wordID: WordsId }) {
  const [{ wordtags, tags }] = useData(['wordtags', 'tags']);
  return (
    <ul id="termtags">
      {wordtags
        .filter(({ WtWoID }) => WtWoID === wordID)
        .map((tag) => (
          <li>
            {
              // TODO better lookup very inefficient
              tags.find(({ TgID }) => tag.WtTgID === TgID)!.TgText
            }
          </li>
        ))}
    </ul>
  );
}
