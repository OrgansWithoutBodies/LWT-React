import { loremIpsum } from "lwt-common";
import { Header } from "../../../../LWT-UI-Kit/src";

export function LoremIpsum({ len = 10 }: { len?: number }) {
  return (
    <>
      <Header title={"Lorem Ipsum Plugin Demo" as any} />
      {loremIpsum(len)}
    </>
  );
}
