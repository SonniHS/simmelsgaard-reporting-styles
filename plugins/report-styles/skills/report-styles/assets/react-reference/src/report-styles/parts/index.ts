import type { StyleParts } from "../ReportPage";
import type { StyleId } from "../tokens.generated";
import type { KeyFiguresVM } from "../viewModel";
import { graphicParts } from "./graphic";
import { ibcsParts } from "./ibcs";
import { showcaseParts } from "./showcase";
import { softParts } from "./soft";

export type PartsFactory = (vm: KeyFiguresVM, ctx: { phone: boolean }) => StyleParts;

/** Each style's parts for the Key figures page. A new style adds a factory here and a token file; the page is shared. */
export const STYLE_PARTS: Record<StyleId, PartsFactory> = {
  ibcs: ibcsParts,
  showcase: showcaseParts,
  soft: softParts,
  graphic: graphicParts,
};
