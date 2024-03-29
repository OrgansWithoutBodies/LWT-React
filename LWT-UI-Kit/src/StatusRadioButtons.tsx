import { TRefMap } from "lwt-forms";
import { StrengthMapNumericalKey, Word } from "lwt-schemas";
import { useEffect, useState } from "react";

/**
 *
 */
export function StatusRadioButtons<TEntryType extends Pick<Word, "WoStatus">>({
  defaultStatus = 1,
  refMap,
  onChange,
}: {
  defaultStatus?: Word["WoStatus"];
  refMap: TRefMap<TEntryType>;
  onChange?: () => void;
}) {
  // TODO hacky
  const [currentStatus, setcurrentStatus] = useState(defaultStatus);
  const setRef = (event: React.ChangeEvent<HTMLInputElement>) => {
    refMap.WoStatus.current = event.target;
    setcurrentStatus(
      Number.parseInt(refMap.WoStatus.current.value) as Word["WoStatus"]
    );
  };
  useEffect(() => {
    if (onChange) {
      onChange();
    }

    return () => {};
  }, [currentStatus]);

  currentStatus;
  return (
    <>
      {([1, 2, 3, 4, 5, 99, 98] as const).map((status) => (
        <>
          <span
            className={`status${status}`}
            style={{ cursor: "pointer" }}
            title={StrengthMapNumericalKey[status].name}
            // TODO hacky
            onClick={() => setRef({ target: { value: `${status}` } } as any)}
          >
            <input
              style={{ cursor: "pointer" }}
              type="radio"
              name="WoStatus"
              value={status}
              onChange={setRef}
              checked={currentStatus === status}
            />
            {StrengthMapNumericalKey[status].abbr}&nbsp;
          </span>{" "}
        </>
      ))}
    </>
  );
}
