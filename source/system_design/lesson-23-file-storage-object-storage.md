# Lesson 23 — File Storage and Object Storage

**Course:** System Design — From the Ground Up  
**Module 4 — Core Architecture Components**

## Lesson Overview

Applications often need to store files that are much larger or less structured than database rows. File systems and object storage offer different access and operational models.

## Local and Shared File Systems

Local disk is straightforward for temporary files and workloads tied to one host, but files may be unavailable when that host fails or when another application instance needs them. Shared file systems provide a common filesystem interface across hosts, but introduce network dependencies, capacity planning, and their own availability constraints.

## Object Storage

Object storage stores data as objects in a namespace or bucket, with metadata and an identifier. It is commonly used for images, videos, backups, archives, and data exports. Applications access objects through an API rather than assuming ordinary local filesystem semantics. Object storage can scale independently from application servers.

## Database Metadata and File Bytes

A common pattern stores file bytes in object storage and keeps metadata in a database: owner, object key, content type, size, checksum, and lifecycle status. This avoids placing large binary content in ordinary relational rows while retaining searchable ownership and application relationships.

## Uploads, Access, and Recovery

Validate upload size and type, generate safe object names, authorize downloads, and consider malware scanning where appropriate. Signed URLs can allow time-limited direct uploads or downloads without exposing broad storage credentials. Plan versioning, retention, replication, backups, and deletion behavior; object storage is not automatically a complete backup strategy.

## Learning Objectives

- Distinguish object storage from a relational database and local filesystem.
- Trace a secure upload flow using authorization, object storage, and metadata.

## Worked Example

A client asks the API for upload authorization; the API checks permissions and returns a short-lived pre-signed URL. The client uploads to object storage, while the application stores metadata and ownership in the database.

## Check Your Understanding

1. **Why use a pre-signed upload URL?**

   It can allow a client to upload directly without exposing permanent storage credentials.

2. **What should the application verify before granting access to an object?**

   The user's authorization for that specific object and operation.

## Common Pitfall

Making uploads public by default or trusting a client-supplied object key without authorization checks.

## Key Takeaways

Use object storage for scalable file bytes and a database for searchable metadata when that fits the workload. Design authorization, upload validation, lifecycle, and recovery together.

## Practice Exercise

Design photo uploads for a social application. Identify what goes in the database, what goes in object storage, and how a user can securely download a private photo.


### Practice Hint

Draw authorization, upload, metadata persistence, download, and deletion as separate steps.

### Self-Check

Can you explain which system stores the file bytes and which stores ownership and metadata?
## Next Lesson

Lesson 24 — Stateless and Stateful Systems
