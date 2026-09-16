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
        class="@container flex-1 flex flex-col min-w-0 border-r border-zinc-200/60 dark:border-zinc-700/50 bg-white dark:bg-zinc-900 animate-fade-in"
        aria-label="Editor de Markdown"
        data-purpose="editor-section"
      >
        ${renderToolbar()}

        <!-- Editor / Preview Area with Simultaneous Split View Support -->
        <div
          id="workspacePanes"
          class="flex-1 relative flex overflow-hidden w-full h-full"
          data-view-mode="editor"
        >
          ${renderEditorPane()}
          <!-- Split View Divider -->
          <div
            id="splitDivider"
            role="separator"
            aria-orientation="vertical"
            class="hidden w-px bg-zinc-200/80 dark:bg-zinc-700/80 shrink-0 relative select-none"
          >
            <div class="absolute top-1/2 -translate-y-1/2 -left-1 w-2.5 h-8 flex items-center justify-center pointer-events-none opacity-40 hover:opacity-100 transition-opacity">
              <div class="w-0.5 h-4 rounded-full bg-zinc-400 dark:bg-zinc-500"></div>
            </div>
          </div>
          ${renderPreviewPane()}
        </div>

        ${renderWorkspaceFooter()}
      </section>
      <!-- END: Editor Column -->

      ${renderSidebar()}
    `.trim();
}
