import manifest from "@neos-project/neos-ui-extensibility";
import { createClipboardInputTransformationPlugin } from "./ClipboardInputTransformationPlugin";

const addPlugin = (Plugin) => (ckEditorConfiguration, options) => {
    return {
        ...ckEditorConfiguration,
        plugins: [
            ...(ckEditorConfiguration.plugins ?? []),
            Plugin
        ]
    };
};

manifest('Visol.Neos.ClipboardInputTransformation', {}, (globalRegistry, { frontendConfiguration }) => {
    const ckEditorRegistry = globalRegistry.get('ckEditor5');
    const replacementsConfiguration = frontendConfiguration?.['Visol.Neos.ClipboardInputTransformation']?.replacements;

    const config = ckEditorRegistry.get('config');

    if (!replacementsConfiguration || !replacementsConfiguration.length) {
        return;
    }

    const ClipboardInputTransformationPlugin = createClipboardInputTransformationPlugin(replacementsConfiguration);
    config.set('Visol.Neos.ClipboardInputTransformation', addPlugin(ClipboardInputTransformationPlugin));
});
