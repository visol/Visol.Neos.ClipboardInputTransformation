import manifest from "@neos-project/neos-ui-extensibility";

const addPlugin = (Plugin, isEnabled) => (ckEditorConfiguration, options) => {
    if (!isEnabled || isEnabled(options.editorOptions, options)) {
        return {
            ...ckEditorConfiguration,
            plugins: [
                ...(ckEditorConfiguration.plugins ?? []),
                Plugin
            ]
        };
    }
    return ckEditorConfiguration;
};

const createInputSubstitutionPlugin = (replacementsConfiguration) => function (editor) {
    // https://ckeditor.com/docs/ckeditor5/16.0.0/framework/guides/deep-dive/clipboard.html#input-pipeline

    const replacements = replacementsConfiguration.map(({ search, replace }) => [search, replace])

    const replaceText = (textElement, newText) => {
        // todo use `UpcastWriter.createText` and `UpcastWriter.replace` but we cant get ahold of the writer until: https://github.com/neos/neos-ui/issues/3436
        textElement._textData = newText
    }

    const traverseTextElements = (element, textVisitor) => {
        if (element.is("text")) {
            textVisitor(element)
            return
        }

        if (element.childCount) {
            for (const child of element.getChildren()) {
                traverseTextElements(child, textVisitor)
            }
        }
    }

    // fyi when ckeditor is updated, the api changes to `editor.plugins.get('ClipboardPipeline')`
    editor.plugins.get('Clipboard').on(
        'inputTransformation',
        (evt, data) => {
            traverseTextElements(data.content, (textElement) => {
                /** @type string */
                const textContents = textElement.data;

                let newTextContents = textContents;

                for (const [from, to] of replacements) {
                    newTextContents = newTextContents.replaceAll(from, to)
                }

                if (textContents !== newTextContents) {
                    replaceText(textElement, newTextContents)
                }
            })
        },
        { priority: 'high' }
    );
}

manifest('Visol.Neos.InputSubstitution', {}, (globalRegistry, { frontendConfiguration }) => {
    const ckEditorRegistry = globalRegistry.get('ckEditor5');
    const replacementsConfiguration = frontendConfiguration['Visol.Neos.InputSubstitution'].replacements;

    const config = ckEditorRegistry.get('config');

    if (!replacementsConfiguration || !replacementsConfiguration.length) {
        return;
    }

    const InputSubstitutionPlugin = createInputSubstitutionPlugin(replacementsConfiguration);
    config.set('Visol.Neos.InputSubstitution', addPlugin(InputSubstitutionPlugin, () => true));
});
