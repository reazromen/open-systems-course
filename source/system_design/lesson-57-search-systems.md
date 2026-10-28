# Lesson 57: Search Systems

Search makes large collections discoverable by building an index optimized for queries. The index is usually a derived representation, not the authoritative source of the data.

## Source of truth and index

The primary database stores canonical records. A pipeline updates a search index with searchable fields, tokens, filters, and ranking signals. This creates a freshness delay that must fit product needs.

## Build for query patterns

Analyzers handle tokenization, language, stemming, and synonyms. Structured fields support filters and sorting. Indexing every field increases storage and update costs.

## Query and ranking

Combine text relevance with filters, popularity, freshness, or personalization. Define stable pagination and evaluate ranking with representative queries.

## Updates and deletion

Use an outbox, change-data-capture, or reliable event pipeline. Consumers must tolerate duplicate events. Deletions and permission changes must reach the index promptly; sensitive results may need authorization checks at query time.

## Scale and observe

Replicas and partitions help scale but add operational complexity. Monitor query latency, zero-result rate, indexing lag, errors, and resource use. Plan rebuilds and mapping changes carefully.

## Learning Objectives

- Separate the source of truth from a search index.

- Design indexing and queries around real search requirements.

- Handle updates, deletions, relevance, and eventual index consistency.

## Worked Example

A product is deleted from the catalog database but remains in the search index for a short time.

**Reasoning:** Publish durable change events or use a reliable change-data-capture pipeline, make index updates idempotent, and ensure deletion or access restrictions propagate promptly. If necessary, validate critical results against authoritative data.

## Check Your Understanding

Why should a search index usually not be treated as the source of truth?

- A. Indexes cannot return results.

- B. It is a derived structure optimized for retrieval and may lag behind authoritative records.

- C. Databases cannot store product data.

**Answer and explanation:** B — the index is often rebuilt or updated from authoritative data and can temporarily lag.

## Common Pitfall

Ignoring deletion propagation, allowing removed or private records to remain searchable.

## Practice Hint

Trace create, update, and delete events through the indexing pipeline and define acceptable indexing lag.

## Self-Check

Can you explain how the search index is refreshed and how deletions are enforced?

## Key Takeaways

Treat the index as a derived view. Model actual query patterns, handle reindexing and deletion, and measure relevance as well as health.

## Practice Exercise

Design product search with a catalog database, change pipeline, index, and query API. How will you prevent deleted or private records from remaining visible?
