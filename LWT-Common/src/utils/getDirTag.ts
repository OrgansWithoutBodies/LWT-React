import { Language } from "lwt-schemas";

export const getDirTag = (
  language: Pick<Language, "LgRightToLeft">
): { dir: "rtl" | "ltr" } => ({
  dir: language.LgRightToLeft ? "rtl" : "ltr",
});
