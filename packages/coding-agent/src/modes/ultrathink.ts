import ultrathinkNotice from "../prompts/system/ultrathink-notice.md" with { type: "text" };
import { createGradientHighlighter, type KeywordHighlighter } from "./gradient-highlight";
import { keywordInProse } from "./markdown-prose";

/**
 * "ultrathink" keyword support, mirroring Claude Code's affordance.
 *
 * Typing the standalone word in the input editor paints it with a rainbow
 * gradient ({@link highlightUltrathink}); submitting a message that mentions it
 * appends a hidden {@link ULTRATHINK_NOTICE} nudging the model toward careful
 * multi-step reasoning. Matching is case-sensitive (lowercase only) and
 * token-bounded: the standalone word counts even when wrapped in punctuation
 * ("ultrathink.", '"ultrathink"'), but "ultrathinking", "Ultrathink", and
 * path-embedded forms like "ultrathink.ts" never trigger either behavior.
 */

// Detection: lowercase keyword flanked by whitespace or a string edge, allowing wrapping
// punctuation (`ultrathink.`, `"ultrathink"`) but not punctuation glued to word characters
// (`ultrathink.ts`). Non-global so `.test` stays stateless.
const ULTRATHINK_WORD = /(?<=(?:^|\s)[^\w\s]*)ultrathink(?=[^\w\s]*(?:\s|$))/;

/** Hidden system notice appended after a user message that mentions "ultrathink". */
export const ULTRATHINK_NOTICE: string = ultrathinkNotice.trim();

/**
 * Whether `text` contains the standalone keyword "ultrathink" (lowercase,
 * whitespace-delimited) in prose — never inside a code block, inline code span,
 * or XML/HTML section.
 */
export function containsUltrathink(text: string): boolean {
	return keywordInProse(text, ULTRATHINK_WORD);
}

/**
 * Rainbow-highlight every standalone "ultrathink" in `text` for editor display.
 * Sweeps red→violet (hue 0..330), stopping short of the wrap back to red so the
 * gradient resolves smoothly regardless of casing or match length.
 */
export const highlightUltrathink: KeywordHighlighter = createGradientHighlighter({
	probe: /ultrathink/,
	highlight: /(?<=(?:^|\s)[^\w\s]*)ultrathink(?=[^\w\s]*(?:\s|$))/g,
	stops: 14,
	hue: t => t * 330,
});
