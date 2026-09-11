import { renderFormattingTools } from './FormattingTools.js';
import { renderUtilityTools } from './UtilityTools.js';

/**
 * Toolbar Template
 * Assembles formatting tools and utility tools within the toolbar header bar.
 *
 * @returns {string} HTML markup string
 */
export function renderToolbar() {
    return /* html */ `
        <!-- Toolbar -->
        <div
          class="flex items-center justify-between px-2 @[500px]:px-3 border-b border-zinc-200/60 dark:border-zinc-700/50 text-zinc-600 dark:text-zinc-300 bg-zinc-50/50 dark:bg-zinc-800/50 shrink-0 h-10 select-none gap-1 @[500px]:gap-1.5 min-w-0"
        >
          ${renderFormattingTools()}
          ${renderUtilityTools()}
        </div>
    `.trim();
}
