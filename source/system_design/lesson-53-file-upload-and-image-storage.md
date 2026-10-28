# Lesson 53: File Upload and Image Storage

A robust upload flow validates metadata and content, stores the original safely, creates derived images asynchronously, and serves files efficiently with appropriate access controls.

## Safe upload flow

For large files, issue a short-lived signed upload URL so clients send bytes directly to object storage. The API authenticates the user, checks quota and type, and creates an upload record; completion must be verified.

## Validate before publishing

Do not trust filenames or client MIME types. Check file signatures, size, dimensions, and supported formats; scan when appropriate. Keep uploads pending until validation succeeds.

## Process asynchronously

Workers generate thumbnails and responsive variants. Store owner, object key, checksum, dimensions, and status. Make jobs idempotent so retries do not create inconsistent records.

## Serve securely

CDNs can cache public assets. Private files need authorization-aware access or signed URLs. Avoid predictable public keys and define retention and deletion for originals and variants.

## Reconcile failures

Uploads can finish while callbacks fail, or database records can point to missing objects. Reconciliation detects orphaned files and stale records. Monitor upload success, processing delay, and storage growth.

## Key Takeaways

Keep large bytes out of the main API path when possible. Validate content, process asynchronously, protect private files, and reconcile storage against metadata.

## Practice Exercise

Design a profile-photo upload flow with signed uploads, quarantine, processing workers, object storage, metadata, and a CDN. Include processing failure behavior.
