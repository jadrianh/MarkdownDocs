import { describe, it, expect, beforeEach } from 'vitest';
import { ParserManager } from './parser.manager.js';

describe('MarkdownParserManager & Profiles', () => {
    beforeEach(() => {
        ParserManager.setProfile('gfm');
    });

    it('has 3 available profiles registered', () => {
        const profiles = ParserManager.getAvailableProfiles();
        expect(profiles.length).toBe(3);
        const ids = profiles.map(p => p.id);
        expect(ids).toContain('gfm');
        expect(ids).toContain('academic');
        expect(ids).toContain('commonmark');
    });

    describe('GitHub Flavored Markdown (GFM)', () => {
        it('renders tables, strikethrough, and task lists', () => {
            ParserManager.setProfile('gfm');
            const md = `
| Col1 | Col2 |
| ---- | ---- |
| A    | B    |

- [ ] Tarea pendiente
- [x] Tarea hecha

~~tachado~~
`;
            const html = ParserManager.parse(md);
            expect(html).toContain('<table');
            expect(html).toContain('task-list-item');
            expect(html).toContain('<del>tachado</del>');
        });

        it('transforms GitHub alert blockquotes into styled alert callouts', () => {
            ParserManager.setProfile('gfm');
            const md = `
> [!NOTE]
> Esta es una nota informativa de GitHub.

> [!WARNING]
> Cuidado con esta advertencia.
`;
            const html = ParserManager.parse(md);
            expect(html).toContain('markdown-alert-note');
            expect(html).toContain('markdown-alert-warning');
            expect(html).toContain('octicon-info');
            expect(html).toContain('octicon-alert');
            expect(html).toContain('Note');
            expect(html).toContain('Warning');
        });
    });

    describe('Academic Profile (LaTeX & Footnotes)', () => {
        it('renders math equations with KaTeX', () => {
            ParserManager.setProfile('academic');
            const md = 'La energía es $E=mc^2$ según Einstein.';
            const html = ParserManager.parse(md);
            expect(html).toContain('katex');
        });

        it('renders footnotes and appends references list', () => {
            ParserManager.setProfile('academic');
            const md = `
Texto con afirmación importante[^1] y otra nota[^fuente].

[^1]: Explicación detallada de la primera nota.
[^fuente]: Referencia bibliográfica formal.
`;
            const html = ParserManager.parse(md);
            expect(html).toContain('footnote-ref');
            expect(html).toContain('<section class="footnotes');
            expect(html).toContain('Explicación detallada de la primera nota.');
            expect(html).toContain('Referencia bibliográfica formal.');
        });
    });

    describe('CommonMark Strict Profile', () => {
        it('renders standard Markdown faithfully', () => {
            ParserManager.setProfile('commonmark');
            const md = '# Encabezado Principal\n\nTexto con *énfasis* y **fuerza**.';
            const html = ParserManager.parse(md);
            expect(html).toContain('<h1>Encabezado Principal</h1>');
            expect(html).toContain('<em>énfasis</em>');
            expect(html).toContain('<strong>fuerza</strong>');
        });
    });

    describe('Security & Manager Behavior', () => {
        it('neutralizes malicious XSS scripts across all profiles', () => {
            const malicious = '<script>alert("hack")</script><img src="x" onerror="alert(1)">Texto seguro';
            
            ['gfm', 'academic', 'commonmark'].forEach(profileId => {
                ParserManager.setProfile(profileId);
                const html = ParserManager.parse(malicious);
                expect(html).not.toContain('<script>');
                expect(html).not.toContain('onerror=');
                expect(html).toContain('Texto seguro');
            });
        });

        it('notifies subscribers when profile changes', () => {
            let notifiedProfile = null;
            const unsubscribe = ParserManager.subscribe((profile) => {
                notifiedProfile = profile;
            });

            ParserManager.setProfile('academic');
            expect(notifiedProfile?.id).toBe('academic');

            unsubscribe();
            ParserManager.setProfile('commonmark');
            expect(notifiedProfile?.id).toBe('academic'); // no longer notified
        });
    });
});
