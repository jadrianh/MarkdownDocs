import { state } from './state.js';
import { ThemeManager } from '../theme/themeManager.js';
import { initEditorController } from '../editor/editor.controller.js';
import { initGrammarController } from '../api/grammar/grammar.controller.js';

document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    
    const editorElement = document.getElementById('editor');
    state.history.push(editorElement.value);

    initEditorController();
    initGrammarController();
});