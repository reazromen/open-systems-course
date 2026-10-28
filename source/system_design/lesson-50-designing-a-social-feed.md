# Lesson 50: Designing a Social Feed

A social feed displays posts from followed accounts, often ranked by time or relevance. Its key trade-off is assembling feeds at read time or preparing entries when posts are published.

## Define the experience

Clarify chronological versus ranked display, follows, private posts, deletion, and pagination. Feed reads often greatly outnumber post creation.

## Fan-out on read

Fetch recent posts from followed accounts and merge them when the feed opens. Publishing stays simple, but reads can be expensive for users following many accounts.

## Fan-out on write

Precompute feed entries for followers when a post is published. Reads become faster, but celebrity posts create huge write bursts. A hybrid can precompute ordinary accounts and handle very large accounts at read time.

## Feed storage and pagination

Store references to canonical posts with creation or ranking metadata. Use stable cursors rather than large offsets; offsets can become slow and inconsistent as new posts arrive.

## Freshness and privacy

Precomputed feeds can contain stale references after deletion or privacy changes. Recheck visibility rules, clean stale entries, and monitor latency, fan-out backlog, cache hits, and ranking time.

## Key Takeaways

Choose based on read/write patterns. Keep posts canonical, paginate with cursors, and enforce privacy even for precomputed feed entries.

## Practice Exercise

Compare read-time fan-out, write-time fan-out, and a hybrid for a platform with one very popular account.
