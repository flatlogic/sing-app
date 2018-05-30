# Contributing to Sing App

Your contributions are welcome and are greatly appreciated! Every little bit helps, and credit
will always be given.

Please take a moment to review this document in order to make the contribution process easy and
effective for everyone involved.

## Conduct

Please, follow the [golden rule](https://en.wikipedia.org/wiki/Golden_Rule). Be respectful, even to
those that are disrespectful.

## Feedback

Feedback is the breakfast for champions! We'd love to hear your opinions, discuss potential
improvements, architecture, theory, internal implementation, etc. Please, join or start a new
conversation in our [issue tracker](https://github.com/flatlogic/react-dashboard/issues).

## Documentation

We need your help with improving documentation to the project. This might be the easiest way for
you to contribute, because you don't even need to clone the repo but can edit or create new `.md`
files right from GitHub website as described [here](https://help.github.com/articles/editing-files-in-your-repository/).

## Bugs & Feature Requests

Before opening an issue, please:

* Check [Documentation](https://demo.flatlogic.com/sing-app/documentation).
* Search the [issue tracker](https://github.com/flatlogic/sing-app/issues) to make sure
  your issue hasn’t already been reported.
* If your issue sounds more like a question, please post it on StackOverflow.com instead with the
  tag [sing-app](http://stackoverflow.com/questions/tagged/sing-app).

## Pull Requests

Before you submit a [pull request](https://help.github.com/articles/using-pull-requests/) from your
forked repo, check that it meets these guidelines:

* If the pull request adds functionality, the docs should be updated as part of the same PR.
* Create a separate PR for each small feature or bug fix.
* [Squash](http://stackoverflow.com/questions/5189560/squash-my-last-x-commits-together-using-git)
  your commits into one for each PR.
* When contributing to an opt-in feature, apply the `[feature/...]` tag as a prefix to your PR title

## Style Guide

We follow [Airbnb's Style Guide](https://github.com/airbnb/javascript) for best practices writing javascript code.

## Commit Message Guidelines

We have very precise rules over how our git commit messages can be formatted.  This leads to **more
readable messages** that are easy to follow when looking through the **project history**.  But also,
we use the git commit messages to **generate the ngx-admin change log**.

### Commit Message Format
Each commit message consists of a **header**, a **body** and a **footer**.  The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

### Revert
If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of
the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is
the SHA of the commit being reverted.

### Type
Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, etc)
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing tests or correcting existing tests
* **build**: Changes that affect the build system, CI configuration or external dependencies
            (example scopes: gulp, broccoli, npm)
* **chore**: Other changes that don't modify `src` or `test` files
* **relese**: Release version commit

### Scope
The scope could be anything specifying place of the commit change. For example
`menu`, `sidebar`, etc.

### Subject
The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

### Body
Optional. Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer
Optional. The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines.
The rest of the commit message is then used for this.

## License

By contributing to Sing App, you agree that your contributions will be licensed under its
[MIT license](https://github.com/flatlogic/sing-app/blob/master/LICENSE).
