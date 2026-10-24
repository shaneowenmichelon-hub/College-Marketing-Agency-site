# Writing rules for Collegiate Agency articles

Adapted from the MIT-licensed mentionstack humanization rules by Dylan Ander
(Copyright (c) 2026 Dylan Ander; Copyright (c) 2026 Toprank Contributors).
The phrase list and the checker are the parts we kept. See `THIRD_PARTY_NOTICES.md`.

These rules are for a new article the SEO publisher drafts. The audience is a
brand buyer: CPG, beverage, app, retail, entertainment, field, shopper,
experiential, and growth marketers who purchase campus reach. Students are the
audience of the campaign, not the audience of the page. Write in second person.
Say what to do and how to judge the work.

`scripts/writing_quality.py` rejects a new article body that uses a banned
phrase, contains an em dash, or opens with a prose paragraph longer than 3
sentences. Articles already in `content/blog` are not rewritten and do not fail
the build.

## Opening

The first prose paragraph is 2-3 sentences and answers the query. An AI engine
should be able to quote it without the rest of the page. No throat-clearing
and no scene-setting that delays the answer. The checker rejects a first prose
paragraph longer than 3 sentences.

## Sentences

Use active voice. The subject does the action. Keep most paragraphs to 2-4
sentences. Stay at a 10th-grade reading level: plain short words, and a
specialist term only when the buyer needs it.

## Punctuation

No em dashes. Use a comma, a period, parentheses, or a colon.

## Sources

When a claim depends on a source, name the source with its title, publisher,
publication date, and URL, and link that URL from the claim. If you cannot
name all four, cut the claim. Do not invent statistics, clients, quotes,
prices, or results. A hypothetical example has to be labeled as an example.

## Links

Use natural anchor text that tells the reader what they will get. "Click here"
and "read more" are not anchors. Put links in the paragraph where they help a
decision. Do not dump them in a list at the bottom.

## Banned phrases

`content/seo/banned-phrases.txt` lists the words and phrases the checker
rejects. Ordinary connectors stay available, including however, therefore,
additionally, also, and because. Do not swap one banned phrase for another
banned phrase.
