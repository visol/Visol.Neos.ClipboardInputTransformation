# Visol.Neos.ClipboardInputTransformation

```sh
composer require visol/neos-clipboardinputtransformation
```

Define a map of search and replacement strings, which are transformed when pasting content into the rich-text editor.

```yaml
Neos:
  Neos:
    Ui:
      frontendConfiguration:
        "Visol.Neos.ClipboardInputTransformation":
          replacements:
            # for example replace LSEP and PSEP unicode chars
            - search: "\u2029"
              replace: ""
            - search: "\u2028"
              replace: ""
            # or replace any string
            - search: "speak now"
              replace: "echo now"
```

# Credits

Created for visol by Marc Henry Schultz, https://github.com/mhsdesign

visol digitale Dienstleistungen GmbH, www.visol.ch
