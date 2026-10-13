---
title: "Retrieval-Augmented Generation and Evidence"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-175-retrieval-augmented-generation-and-evidence.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 14
excerpt: "RAG retrieves external evidence before generation. Its quality depends on indexing, chunking, metadata, permissions, query transformation, ranking, freshness, citation, and how the model uses retrieved context."
eyebrow: "Open Systems Course · Lesson 175 of 180"
---

A model cannot contain every current document in its parameters.

Retrieval-Augmented Generation, or RAG, adds a search step before generation.

The pipeline becomes:

question → retrieve evidence → assemble context → model → answer.

That simple diagram hides an entire information-retrieval system.

## Retrieval and generation are separate evaluations

A wrong answer can happen because:

the right document was never indexed;
the query failed to retrieve it;
the ranker placed it too low;
the chunk lacked context;
the model ignored correct evidence;
the evidence itself was stale.

Do not evaluate only final prose.

Measure retrieval and generation separately.

## Ingestion defines what can be found

Documents enter through:

parsing;
chunking;
metadata extraction;
embedding;
indexing.

If a PDF table is parsed incorrectly, retrieval cannot recover the lost structure later.

Ingestion quality is part of answer quality.

## Hybrid retrieval combines signals

Semantic vector search is good for meaning.

Lexical search is good for exact identifiers, error codes, names, and rare terms.

Hybrid systems combine both, sometimes with a reranker.

One method does not dominate every query.

## Metadata filters enforce scope

A search for “invoice” can return documents from another tenant unless access constraints are applied before results reach the model.

Filter by:

tenant;
user permission;
document classification;
time;
product;
language.

Do not retrieve broadly and ask the model not to reveal unauthorized context.

Authorization must occur in retrieval.

## Reranking improves top results

Initial retrieval can fetch dozens of candidates cheaply.

A stronger ranking model or cross-encoder can reorder the shortlist.

This spends additional compute to improve relevance before context assembly.

The architecture trades latency for retrieval quality.

## Freshness needs an update pipeline

A RAG system can answer from an obsolete policy if its index lags behind the source.

Track:

source version;
ingestion time;
document updated time;
index version.

Deletion matters too.

Removing a document from source should remove it from retrieval under defined timing.

## Citations should point to evidence, not invented URLs

A robust system can carry source IDs and exact document locations from retrieval into the answer renderer.

The model should not invent citation links from memory.

Citation correctness is an application-data problem.

## Retrieval does not make the answer true

The model can still misread correct evidence.

Documents can conflict.

Retrieved content can contain malicious instructions.

A high-stakes system may need extractive answers, deterministic rules, or human review.

RAG improves grounding; it does not eliminate reasoning error.

## Practical experiment

Take 50 documents you control.

Create five questions with known source paragraphs.

Measure:

whether correct document appears in top 5;
whether correct chunk appears;
whether generated answer matches evidence;
whether citation points to correct source.

Then change chunk size and compare retrieval.

The exercise reveals which layer changed quality.

## The lesson to carry forward

RAG connects models to external knowledge through a searchable evidence pipeline.

The next lesson allows the model to affect the world through tools—and introduces much stronger authority boundaries.
