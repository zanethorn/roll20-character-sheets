#/bin/bash
mustache properties.json CharacterSheet.mustache > CharacterSheet.html
lessc CharacterSheet.less > CharacterSheet.css