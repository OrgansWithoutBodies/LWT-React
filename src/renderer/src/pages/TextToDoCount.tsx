import { useData } from '../hooks/useAkita';
import { Text } from '../utils/parseMySqlDump';

/**
 *
 * @param text
 */
export function TextToDoCount({ text }: { text: Text }): JSX.Element {
  const [{ textitems, words }] = useData(['textitems', 'words']);
  const textItemsForThisText = textitems.filter(
    (val) =>
      val.TiLgID === text.TxLgID &&
      val.TiIsNotWord === 0 &&
      val.TiTxID === text.TxID &&
      val.TiWordCount === 1
  ).length;
  const wordsForThisText = words.filter(
    (val) => val.WoLgID === text.TxLgID
  ).length;
  const c = wordsForThisText - textItemsForThisText;
  return (
    <>
      {c > 0 ? (
        <>
          <span title="To Do" className="status0">
            &nbsp;{c}&nbsp;
          </span>
          <>
            &nbsp;&nbsp;&nbsp;
            <input
              type="button"
              onClick={() => iknowall()}
              value=" I KNOW ALL "
            />
          </>
        </>
      ) : (
        <>
          <span title="To Do" className="status0">
            &nbsp;{c}&nbsp;
          </span>
        </>
      )}
    </>
  );
}
