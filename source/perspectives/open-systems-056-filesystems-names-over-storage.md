---
title: "Filesystems: Names over Storage"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-056-filesystems-names-over-storage.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "A filesystem turns storage blocks into named objects, directories, metadata, permissions, and durable update rules. The filename you see is an abstraction over a much larger persistence system."
eyebrow: "Open Systems Course · Lesson 56 of 180"
---

An SSD exposes persistent storage.

Your application wants:

    /home/romen/notes.txt

Between those two ideas sits a filesystem.

The filesystem gives names, directories, metadata, permissions, and allocation rules to persistent data.

Without it, applications would have to manage raw storage locations directly.

## A pathname is not the file data

Consider:

    /home/user/photo.jpg

The path is a sequence of names used to locate an object through directory relationships.

The bytes of the photo live elsewhere in filesystem-managed storage.

Rename the file.

The image data may not move at all.

The name changed.

The underlying object and its allocated blocks can remain.

This distinction becomes especially visible on Unix-like filesystems.

## Inodes separate metadata from names

On many Unix filesystems, an inode represents filesystem object metadata while directory entries associate names with inode numbers.

The inode can describe attributes such as:

- file type;
- ownership;
- permissions;
- size;
- timestamps;
- block mappings.

The filename lives in the directory entry.

This explains hard links.

Two directory entries can refer to the same inode.

Delete one name and the underlying file data can remain reachable through another link.

"Delete file" is therefore partly a namespace operation.

## Directories are data structures

A directory is not merely a visual folder.

It maps names to filesystem objects.

For a small directory, the implementation may be simple.

For directories containing huge numbers of entries, filesystems use indexing or tree structures to keep lookup efficient.

The filesystem is itself a database-like system maintaining structured metadata over storage.

## Allocation connects files to blocks

A file may occupy several storage extents or blocks.

The filesystem tracks which storage regions belong to which files and which are free.

Growing a file can require allocating more blocks.

Deleting a file can return blocks to the free-space pool.

Fragmentation can occur when logically adjacent file data is physically scattered.

Modern filesystems use many strategies to manage allocation efficiently.

The path abstraction hides all of this.

## Crash consistency is the difficult part

Imagine creating a file requires:

1. allocate inode;
2. allocate data block;
3. write directory entry;
4. update free-space metadata.

Power fails after step 2.

Now internal metadata may disagree.

Filesystems use techniques such as journaling or copy-on-write designs to maintain recoverable consistency under crashes.

The exact mechanism differs by filesystem.

"Write bytes" is not the whole persistence problem.

The metadata describing those bytes must remain coherent too.

## Caches sit in front of storage

Operating systems cache file data in RAM.

Read a file once.

Read it again.

The second read may come from page cache rather than physical storage.

Write a file.

The kernel may buffer dirty data before later flushing it.

This improves performance.

It complicates durability.

A successful write call does not necessarily mean the bytes are already on stable storage unless the relevant API and filesystem guarantees say so.

Databases care intensely about this boundary.

## Mounts combine filesystems into one namespace

Linux can mount separate filesystems into one directory tree.

A path such as:

    /mnt/data

may enter a completely different storage device or network filesystem.

The path looks continuous.

The underlying persistence system changed.

This is abstraction at the namespace level.

You can cross device boundaries without the application path syntax changing.

## Permissions live on filesystem objects

Unix permission bits and ownership metadata let the kernel decide whether a process may read, write, or execute.

Filesystems can support richer access-control models too.

The decision combines:

- process credentials;
- object metadata;
- mount options;
- security modules;
- filesystem semantics.

A permission error is therefore not "the disk refusing."

It is access policy enforced through the operating-system filesystem layer.

## Exercise: separate path, inode, and data

On Linux, use files you own:

    echo hello > a.txt
    ln a.txt b.txt
    ls -li a.txt b.txt

You should see two names with the same inode number on a filesystem that supports hard links.

Remove one:

    rm a.txt

The other can still contain the data.

This makes the difference between name and object tangible.

## The lesson to carry forward

A filesystem transforms block storage into a persistent namespace.

It manages:

- names;
- objects;
- metadata;
- directories;
- allocation;
- permissions;
- caching;
- crash recovery.

When you call open("/path/file"), you are using an enormous abstraction.

Later, databases will build another persistent abstraction on top of this one.

## Interactive companion exercise

Trace a path from `open(path)` through kernel path resolution and a file descriptor in the [file-I/O timeline](../prototypes/interactive-system-design.html#os-timeline-title). It is a conceptual sequence, not a filesystem implementation.
