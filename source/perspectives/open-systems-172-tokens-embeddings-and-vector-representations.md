---
title: "Tokens, Embeddings, and Vector Representations"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-172-tokens-embeddings-and-vector-representations.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Language models operate on token sequences rather than raw concepts. Embeddings map discrete items into continuous vector spaces, enabling similarity, retrieval, clustering, and learned internal representation."
eyebrow: "Open Systems Course · Lesson 172 of 180"
---

A language model does not receive a paragraph as human semantic meaning.

It receives tokens.

A tokenizer converts text into discrete token identifiers.

Those identifiers are mapped into vectors.

The model transforms those vectors through many layers.

## Tokenization changes the cost model

A token can represent:

a whole word;
part of a word;
punctuation;
bytes or character fragments depending on tokenizer.

Therefore:

one character ≠ one token;
one word ≠ one token.

Context limits, billing, latency, and memory usually depend on token count rather than visible word count.

Languages tokenize differently under different vocabularies.

## Vocabulary is finite

A tokenizer has a finite vocabulary.

Uncommon strings are represented as combinations of smaller units.

Source code, URLs, IDs, Bangla text, and natural English can have different token efficiency.

This is why token counts should be measured with the actual tokenizer used by the model.

## Embeddings map identifiers to vectors

A token embedding is a learned vector associated with a token ID.

The model then adds or combines positional information and processes the sequence.

Other embedding models map larger pieces of text, images, or other objects into vectors intended for similarity tasks.

These two uses of the word embedding are related but not identical.

## Vector similarity is a geometric proxy

Given text embeddings, systems often compare vectors using measures such as cosine similarity or dot product.

Nearby vectors can correspond to semantically related inputs under the embedding model.

This enables:

semantic search;
clustering;
deduplication;
recommendation;
retrieval.

Similarity is model-dependent.

A high score is not a universal semantic truth.

## Approximate nearest-neighbor search trades exactness for speed

Searching millions of vectors exactly can be expensive.

Vector indexes such as HNSW or inverted-file methods organize the space so likely nearest neighbors can be found quickly.

“Approximate” means some true nearest neighbors may be missed.

Index parameters trade:

memory;
build time;
query latency;
recall.

Again, this is a data-system problem.

## Chunking changes retrieval semantics

For document search, the unit embedded might be:

sentence;
paragraph;
section;
fixed token window.

Too-small chunks lose context.

Too-large chunks mix several topics and consume model context.

Chunking is therefore part of retrieval quality.

There is no universally correct chunk size.

## Metadata is as important as vectors

A vector store should also preserve:

document ID;
source;
timestamp;
permissions;
version;
section;
language.

At retrieval time, filters can enforce tenant or access boundaries.

A semantically similar result from the wrong tenant is a security failure.

## Embeddings can leak information

Embeddings are derived representations, not automatically anonymous.

Treat them as potentially sensitive if generated from sensitive data.

Access control, retention, and deletion requirements can apply to vector indexes too.

## Practical experiment

Take 20 short paragraphs from different technical topics.

Generate embeddings with one model you are authorized to use.

For each paragraph, retrieve the three nearest neighbors.

Then change chunking: split long paragraphs in half.

Observe how neighbors change.

Do not treat one small experiment as a universal benchmark.

The goal is to see that representation and indexing choices shape retrieval.

## The lesson to carry forward

Tokens define the sequence the model actually processes; embeddings create continuous representations useful inside models and retrieval systems.

The next lesson follows inference through the serving stack: tokenization, batching, accelerator memory, KV cache, generation, and streaming.
