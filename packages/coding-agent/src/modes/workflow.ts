import { prompt } from "@oh-my-pi/pi-utils";
import workflowNoticeTemplate from "../prompts/system/workflow-notice.md" with { type: "text" };
import { createGradientHighlighter, type KeywordHighlighter } from "./gradient-highlight";
import { keywordInProse } from "./markdown-prose";

/**
 * "workflowz" keyword support.
 *
 * Typing the standalone word in the input editor paints it with a warm
 * amber→green gradient ({@link highlightWorkflow}); submitting a message that
 * mentions it appends a hidden workflow notice that steers the model to author
 * a deterministic multi-subagent workflow through the active task schema.
 * Matching is case-sensitive (lowercase only) and token-bounded: "workflowz"
 * triggers even when wrapped in punctuation ("workflowz.", '"workflowz"'), but
 * "workflowzed", "Workflowz", and path-embedded forms like "workflowz.ts" never
 * do.
 */

// Detection: lowercase keyword flanked by whitespace or a string edge, allowing wrapping
// punctuation (`workflowz.`, `"workflowz"`) but not punctuation glued to word characters
// (`workflowz.ts`). Non-global so `.test` stays stateless.
const WORKFLOW_WORD = /(?<=(?:^|\s)[^\w\s]*)workflowz(?=[^\w\s]*(?:\s|$))/;

/** WORKFLOW_NOTICE is the default hidden notice for sessions with batched task calls enabled. */
export const WORKFLOW_NOTICE: string = renderWorkflowNotice({ taskBatch: true });

/** renderWorkflowNotice renders the workflow notice for the active task schema. */
export function renderWorkflowNotice({ taskBatch }: { taskBatch: boolean }): string {
	return prompt.render(workflowNoticeTemplate, { taskBatch }).trim();
}

/**
 * Whether `text` contains the standalone keyword "workflowz"
 * (lowercase, whitespace-delimited) in prose — never inside a code block, inline
 * code span, or XML/HTML section.
 */
export function containsWorkflow(text: string): boolean {
	return keywordInProse(text, WORKFLOW_WORD);
}

/**
 * Highlight every standalone "workflowz" in `text` for editor display
 * with a warm amber→green gradient (hue 30..150), visually distinct from
 * ultrathink's rainbow and orchestrate's teal→violet.
 */
export const highlightWorkflow: KeywordHighlighter = createGradientHighlighter({
	probe: /workflowz/,
	highlight: /(?<=(?:^|\s)[^\w\s]*)workflowz(?=[^\w\s]*(?:\s|$))/g,
	stops: 14,
	hue: t => 30 + t * 120,
});
