import { renderToolbar } from '../toolbar/index.js';
import { renderSidebar } from '../sidebar/index.js';
import { renderEditorPane } from './EditorPane.template.js';
import { renderPreviewPane } from './PreviewPane.template.js';
import { renderWorkspaceFooter } from './WorkspaceFooter.js';

/**
 * Workspace (Editor Section) Template
 * Combines toolbar, editor pane, preview pane, and footer bar.
 *
 * @returns {string} HTML markup string
 */
export function renderWorkspace() {
    return /* html */ `
      <!-- BEGIN: Editor Column -->
      <section
        class="@container flex-1 flex flex-col min-w-0 border-r border-zinc-200/60 dark:border-zinc-700/50 bg-white dark:bg-zinc-900"
        aria-label="Editor de Markdown"
        data-purpose="editor-section"
      >
        ${renderToolbar()}

        <!-- Editor / Preview Area -->
        <div class="flex-1 relative overflow-hidden">
          ${renderEditorPane()}
          ${renderPreviewPane()}
        </div>

        ${renderWorkspaceFooter()}
      </section>
      <!-- END: Editor Column -->

      ${renderSidebar()}
    `.trim();
}
