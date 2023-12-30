import { LanguagesID, TextsID } from "lwt-schemas";
import { TextPropsForTextSplitting, splitCheckText } from ".";
import { loremIpsumSplitByWord } from "..";

describe("textParser", () => {
  it("Breaks down paragraph into sentences", () => {
    const numWords = 41;
    // manually derived for val of 41
    const expectedNumSentences = 3;
    const demoText: TextPropsForTextSplitting = {
      TxID: 0 as TextsID,
      TxText: loremIpsumSplitByWord(numWords),
    };

    const loremIpsumSplit = splitCheckText(demoText, {
      LgID: 0 as LanguagesID,
      LgCharacterSubstitutions: "´='|`='|’='|‘='|...=…|..=‥",
      LgExceptionsSplitSentences: "Mr.|Dr.|[A-Z].|Vd.|Vds.",
      LgRegexpSplitSentences: '.!?:;"',
      LgRegexpWordCharacters: "a-zA-ZÀ-ÖØ-öø-ȳ",
      LgRemoveSpaces: 0,
      LgSplitEachChar: 0,
    });
    console.log(loremIpsumSplit);
    expect(
      Object.values(loremIpsumSplit.wordCount).reduce(
        (prev, curr) => prev + curr,
        0
      )
    ).toEqual(numWords);
    expect(
      loremIpsumSplit.symbolList.filter((val) => val.TiIsNotWord === 0).length
    ).toEqual(numWords);
    expect(loremIpsumSplit.sArray.length).toEqual(expectedNumSentences);
    expect(
      loremIpsumSplit.symbolList.map((symbol) => symbol.TiText).join("")
    ).toEqual(demoText.TxText);
    // expect(false).toEqual(true);
  });
  it("Breaks down sentences into tokens", () => {});
});
