import orchestrateNotice from "../prompts/system/orchestrate-notice.md" with { type: "text" };
import { createGradientHighlighter, type KeywordHighlighter } from "./gradient-highlight";
import { keywordInProse } from "./markdown-prose";

/**
 * "orchestrate" keyword support.
 *
 * Typing the standalone word in the input editor paints it with a cool
 * teal→violet gradient ({@link highlightOrchestrate}); submitting a message that
 * mentions it appends a hidden {@link ORCHESTRATE_NOTICE} that switches the model
 * into multi-agent orchestration mode. Matching is case-sensitive (lowercase
 * only) and token-bounded: the standalone word counts even when wrapped in
 * punctuation ("orchestrate.", '"orchestrate"'), but "orchestrated",
 * "Orchestrate", and a path like "orchestrate.ts" never trigger either behavior.
 * Replaces the former `/orchestrate` slash command.
 */

// Detection: lowercase keyword flanked by whitespace or a string edge, allowing wrapping
// punctuation (`orchestrate.`, `"orchestrate"`) but not punctuation glued to word characters
// (`orchestrate.ts`). Non-global so `.test` stays stateless.
const ORCHESTRATE_WORD = /(?<=(?:^|\s)[^\w\s]*)orchestrate(?=[^\w\s]*(?:\s|$))/;

/** Hidden system notice appended after a user message that mentions "orchestrate". */
export const ORCHESTRATE_NOTICE: string = orchestrateNotice.trim();

/**
 * Whether `text` contains the standalone keyword "orchestrate" (lowercase,
 * whitespace-delimited) in prose — never inside a code block, inline code span,
 * or XML/HTML section.
 */
export function containsOrchestrate(text: string): boolean {
	return keywordInProse(text, ORCHESTRATE_WORD);
}

/**
 * Highlight every standalone "orchestrate" in `text` for editor display with a
 * cool teal→violet gradient (hue 150..280), visually distinct from ultrathink's
 * full-spectrum rainbow.
 */
export const highlightOrchestrate: KeywordHighlighter = createGradientHighlighter({
	probe: /orchestrate/,
	highlight: /(?<=(?:^|\s)[^\w\s]*)orchestrate(?=[^\w\s]*(?:\s|$))/g,
	stops: 14,
	hue: t => 150 + t * 130,
});
