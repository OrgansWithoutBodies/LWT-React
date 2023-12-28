import { LWTData, LWTDataKeys, LWTDataVal } from "lwt-schemas";

export function parseSQL(readData: string) {
  const splitTablesRegex = new RegExp(";?\\n\\n", "gu");
  const splitLineRegex = new RegExp(";(?:\\n)", "gu");
  const splitEntryRegex = new RegExp(
    // grab everything in between non-escaped quote chars
    "(?<!\\\\)'(?!')(.*?)(?<!\\\\)'(?!')|(NULL)|('')",
    "gu"
  );
  const keysFromInsertRegex = new RegExp(
    " {3}(?<!:(?:KEY)|(?:PRIMARY KEY \\())`([A-Za-z0-9]*?)`",
    "gu"
  );

  // TODO really not happy with this but unsure of better way to handle solely in-browser

  const parsedData = Object.fromEntries(
    readData
      .split(splitTablesRegex)
      .slice(1)
      .map((tableString) => {
        let headerStr: LWTDataKeys | null = null;
        let keysForThisTableInOrder: keyof LWTData[LWTDataKeys][number] | [] =
          [];
        let arrayForThisTable: LWTDataVal[] = [];
        tableString
          .split(splitLineRegex)
          .filter((line) => line !== "")
          .forEach((line, ii) => {
            if (ii === 0) {
              const dropTableRegex = new RegExp(
                "DROP TABLE IF EXISTS ([a-zA-Z0-9]*)",
                "gu"
              );
              const potentialHeaderStr = dropTableRegex.exec(line);
              if (!potentialHeaderStr) {
                throw new Error("Error during parsing header!");
              }
              headerStr = potentialHeaderStr[1] as keyof LWTData;
            } else if (ii === 1) {
              const createTableRegex = new RegExp(
                `CREATE TABLE \`${headerStr}\` \\((.*)\\)[^\\(\\)]*?$`,
                "gu"
              );
              const keysStr = createTableRegex.exec(line);
              if (!keysStr) {
                throw new Error("Error during parsing key Header!");
              }
              keysForThisTableInOrder = keysStr[1]
                .match(keysFromInsertRegex)
                ?.map((val) => {
                  const regex = new RegExp(
                    " {3}(?<!:(?:KEY)|(?:PRIMARY KEY \\())`([A-Za-z0-9]*?)`",
                    "gu"
                  );
                  const potentialVal = regex.exec(val);
                  if (!potentialVal) {
                    throw new Error("Error during parsing key Vals!");
                  }
                  return potentialVal[1];
                  //   TODO no any
                }) as any;
            } else {
              const cells = line
                .match(splitEntryRegex)
                ?.map((val) =>
                  val.startsWith("'") && val.endsWith("'")
                    ? val.slice(1, val.length - 1)
                    : val
                );
              if (!cells) {
                throw new Error("Error during parsing cell vals!");
              }
              const rowObject = Object.fromEntries(
                cells?.map((cell, ii) => {
                  return [keysForThisTableInOrder[ii], parseCell(cell)];
                })
              );
              // TODO no any
              arrayForThisTable.push(rowObject as any);
            }
          });
        return [headerStr, arrayForThisTable];
      })
  ) as Partial<LWTData>;
  console.log(parsedData);
  return parsedData;

  // tableStrings.forEach((tableVal) => {
  //   if (tableVal === '') {
  //     return;
  //   }
  //   const tableKey = tableVal.slice(0, tableVal.indexOf('` '));
  //   // valid tableKey
  //   if (Object.keys(Persistable).includes(tableKey)) {
  //     const splitRowHeaderFromValues = new RegExp(
  //       `INSERT INTO [a-zA-Z] VALUES\\((.*)\\)\\n;`
  //     );
  //     const entryVals = tableVal.split('INSERT INTO').slice(1);
  //     if (entryVals.length > 0) {
  //       const entryValRegex = new RegExp(` ${tableKey} VALUES\\((.*)\\);\n`);
  //       const entryVal = entryVals[0].match(entryValRegex);
  //       if (entryVal && entryVal?.length > 1) {
  //         // TODO
  //         const entryColRegex = new RegExp("['(.*),']{2,}", 'g');
  //         const cells = entryVal[1].split(entryColRegex);
  //         // console.log({ cells, tableVal, readData });
  //       }
  //     }
  //   }
  // });
}
function parseCell(cell: string) {
  return cell === ""
    ? ""
    : cell === "NULL"
    ? undefined
    : // TODO different than regular isNaN?
    Number.isNaN(cell)
    ? cell
    : Number.isInteger(cell)
    ? Number.parseInt(cell)
    : Number.parseFloat(cell);
}
