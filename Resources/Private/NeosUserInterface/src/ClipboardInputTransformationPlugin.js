
const setTextOfElement = (textElement, newText) => {
    // todo use `UpcastWriter.createText` and `UpcastWriter.replace` but we cant get ahold of the writer until: https://github.com/neos/neos-ui/issues/3436
    textElement._textData = newText
}

const traverseTextElements = (element, textElementVisitor) => {
    if (element.is("text")) {
        textElementVisitor(element)
        return
    }

    if (element.childCount) {
        for (const child of element.getChildren()) {
            traverseTextElements(child, textElementVisitor)
        }
    }
}

export const createClipboardInputTransformationPlugin = (replacementsConfiguration) => function (editor) {
    // https://ckeditor.com/docs/ckeditor5/16.0.0/framework/guides/deep-dive/clipboard.html#input-pipeline

    const replacements = replacementsConfiguration.map(({ search, replace }) => [search, replace])

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
                    setTextOfElement(textElement, newTextContents)
                }
            })
        },
        { priority: 'high' }
    );
}
