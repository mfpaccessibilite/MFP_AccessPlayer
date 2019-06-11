Version en français ci-dessous.

# MFP AccessPlayer demonstration (English version)

You can find in this folder 2 demonstrations of integration with custom theme of the player.

You can easely make your own modifiying the sass files ('.scss') and compiling them. If you need help to compile SCSS file please check this website : (http://compass-style.org/install/)
Once you have install compass tools, in the demo folder containing the sass folder with your updated files type the commande: 
```bash
compass compile
```
you will obtain your updated stylesheets in the stylesheets folder.

the **`demo.scss`** is to style the demo page.
the **`player.scss`** is to customize the video player

don't forget to add in the options **`theme_class`** with your new custom theme to apply it to the player

# MFP AccessPlayer démonstration (version en français)

Vous pouvez trouver dans ce dossier 2 démonstrations d'intégration avec un thême personnalisé du lecteur vidéo.

Vous pouvez facilement faire votre fichier sass ('.scss') de modifiction et compiler celui-ci. Si vous avez besoin d'aide pour compiler les fichier SCSS, merci de suivre les instruction de ce site : (http://compass-style.org/install/)
Une fois que vous avez installé les outils compass, dans le dossier deméo contenant le dossier sass avec vos fichiers mis à jour, entrez la commande suivante :

```bash
compass compile
```
Vous obtiendrez alors vos feuilles de styles à jour dans le dossier stylesheets.

le fichier **`demo.scss`** permet de définir les style de la page de démo
le fichier **`player.scss`** permet de personnaliser le lecteur vidéo

n'oubliez pas d'ajouter dans les options **`theme_class`** avec la class de votre thême personnalisé pour l'appliquer au lecteur vidéo.