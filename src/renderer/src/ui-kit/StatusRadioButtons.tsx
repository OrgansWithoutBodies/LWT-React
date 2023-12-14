import { TRefMap } from '../forms/Forms';
import { Word } from '../utils/parseMySqlDump';

/**
 * TODO this not updating
 */
export function StatusRadioButtons<TEntryType extends Pick<Word, 'WoStatus'>>({
  defaultStatus = 1,
  refMap,
}: {
  defaultStatus?: Word['WoStatus'];
  refMap: TRefMap<TEntryType>;
}) {
  // const [currentStatus, setcurrentStatus] = useState(second)
  const setRef = (event: React.ChangeEvent<HTMLInputElement>) => {
    refMap.WoStatus.current = event.target;
  };
  return (
    <>
      <span className="status1" title="Learning">
        &nbsp;
        <input
          type="radio"
          name="WoStatus"
          value="1"
          onChange={setRef}
          checked={
            refMap.WoStatus.current === null ||
            refMap.WoStatus.current.value === '1'
          }
          ref={refMap.WoStatus}
        />
        1&nbsp;
      </span>
      <span className="status2" title="Learning">
        &nbsp;
        <input
          type="radio"
          name="WoStatus"
          onChange={setRef}
          checked={
            refMap.WoStatus.current && refMap.WoStatus.current.value === '2'
          }
          value="2"
        />
        2&nbsp;
      </span>
      <span className="status3" title="Learning">
        &nbsp;
        <input
          type="radio"
          name="WoStatus"
          checked={
            refMap.WoStatus.current && refMap.WoStatus.current.value === '3'
          }
          onChange={setRef}
          value="3"
        />
        3&nbsp;
      </span>
      <span className="status4" title="Learning">
        &nbsp;
        <input
          onChange={setRef}
          type="radio"
          name="WoStatus"
          checked={
            refMap.WoStatus.current && refMap.WoStatus.current.value === '4'
          }
          value="4"
        />
        4&nbsp;
      </span>
      <span className="status5" title="Learned">
        &nbsp;
        <input
          type="radio"
          onChange={setRef}
          name="WoStatus"
          checked={
            refMap.WoStatus.current && refMap.WoStatus.current.value === '5'
          }
          value="5"
        />
        5&nbsp;
      </span>
      <span className="status99" title="Well Known">
        &nbsp;
        <input
          type="radio"
          onChange={setRef}
          name="WoStatus"
          checked={
            refMap.WoStatus.current && refMap.WoStatus.current.value === '99'
          }
          value="99"
        />
        WKn&nbsp;
      </span>
      <span className="status98" title="Ignored">
        &nbsp;
        <input
          onChange={setRef}
          type="radio"
          name="WoStatus"
          value="98"
          checked={
            refMap.WoStatus.current && refMap.WoStatus.current.value === '98'
          }
        />
        Ign&nbsp;
      </span>
    </>
  );
}
