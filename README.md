# Super User Automatic Corrector

Using Jakub Hampl and Nathan Osman's framework to create a Super User specific Automatic Corrector.

## Purpose

Occasionally we come across posts that are in a very bad state, for which it is tedious to correct every single mistake in the post. That's why Jakub Hampl and Nathan Osman have ealier worked on the [StackExchange™ Editor Toolkit](http://stackapps.com/questions/2209/se-editor-toolkit).

In this version I'm trying to adapt this further with more improvements as well as specific fixes for Super User (which might or might not work on other sites).

In the long end, this tool should not only become valuable for the occasional posts that are in a bad state, but serve as a toolkit that aids in editing in general.

## Feature requests and Issues

Feature requests and Issues are welcome on the [Issues Tab](https://github.com/TomWij/SuperUser-AutomaticCorrector/issues); alternatively, if you don't have or don't wish to make a GitHub account, you are free to send them on [chat](http://chat.stackexchange.com/rooms/118/root-access) (ping me using `@TomWij`) or alternatively e-mail me:

![](http://i.stack.imgur.com/ip9UF.png)

## Roadmap

- Get more stable automatic edits by testing it on posts.
- Merge in additional features from Nathan Osman's version.
- Implement a debugger allowing us to play the regular expressions one-by-one.
- Figure out how to provide automatic updates through GitHub.

## Installation

The latest version can be installed by [clicking here](https://github.com/TomWij/SuperUser-AutomaticCorrector/raw/master/SUAC.user.js), which is equivalent to [viewing the source](https://github.com/TomWij/SuperUser-AutomaticCorrector/blob/master/SUAC.user.js) and clicking on **Raw**. Browsers that support userscripts should then automatically ask for installation.

The stable versions of Google Chrome and Firefox are supported, it might also work on earlier or bleeding edge versions. On Internet Explorer you can try [Trixie](http://www.bhelpuri.net/Trixie/), which might no longer be supported in the future due to lack of maintenance...

After installing, you need to refresh any page you want this user script to be activated on.

***Warning***: This might not work reliable if simultaneously installed with Nathan Osman's version.

## Usage

1. Go to either the inline editor or the full editor.
2. You will see a new button at the top.
3. If you click on the button, things in the post will be corrected.
4. Instead of a preview, a diff will be shown.
5. You can CTRL+Z to undo the corrections all at once.
6. If you press a key, the diff will go away and show a preview again.

**If you come across mistakes, have ideas or feature requests; [*report them please*](https://github.com/TomWij/SuperUser-AutomaticCorrector/issues).** (Alternative ways to contact [here](https://github.com/TomWij/SuperUser-AutomaticCorrector/blob/master/README.md#feature-requests-and-issues))

*Thank you and have fun editing (or drink a coffee while it edits for you)...*