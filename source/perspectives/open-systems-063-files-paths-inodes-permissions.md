---
title: "Files, Paths, Inodes, and Permissions"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-063-files-paths-inodes-permissions.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Linux paths name filesystem objects; inodes carry metadata; ownership and mode bits help determine access. Learning the relationships is more useful than memorizing chmod numbers."
eyebrow: "Open Systems Course · Lesson 63 of 180"
---

You type:

    /etc/ssh/sshd_config

That pathname asks the kernel to traverse a filesystem namespace.

It is not a disk-sector address.

Linux resolves names through directories until it reaches an object.

On common Unix filesystems, the inode concept represents object metadata while directory entries connect names to objects.

## Absolute and relative paths

Absolute:

    /home/user/file

starts at the filesystem root.

Relative:

    projects/app

starts at the process current working directory.

Special directory entries such as dot and dot-dot affect traversal.

Path resolution is a kernel operation with mount, symlink, permission, and namespace rules.

## Inode is not filename

Run:

    ls -li

The leading number is an inode number within that filesystem.

Create a hard link:

    ln original second

Both names can refer to the same inode.

Remove one name.

The other can remain.

A name is therefore not identical to the underlying file object.

## Metadata belongs to the object

Inode metadata can include ownership, permissions, timestamps, size, link count, file type, and pointers or extents describing data placement.

Directory entries provide names.

This split explains many Unix behaviours around links and renames.

It also explains why inode availability can be a separate resource from byte capacity on some filesystems.

## Permission bits create three classes

Classic Unix mode bits describe permissions for:

    user
    group
    other

and operations:

    read
    write
    execute

For regular files, these apply to reading data, modifying data, and execution subject to other rules.

Directories differ.

Directory read relates to listing names.

Write relates to modifying directory entries.

Execute relates to traversal/search.

That distinction matters enormously during troubleshooting.

## chmod numbers are representation, not understanding

Mode 755 represents:

    7 = rwx
    5 = r-x
    5 = r-x

Memorizing 755 is less useful than understanding which actor needs which permission.

Do not solve every access error with:

    chmod 777

That removes a protection boundary rather than explaining the problem.

## Permission bits are not the whole security model

Linux capabilities can split privileged authority.

SELinux, AppArmor, or other Linux Security Module policy can add checks.

Mount options can restrict execution or device behaviour.

Namespaces change visibility.

So if the mode bits look correct and access still fails, another layer may be enforcing policy.

## Ownership is numeric underneath

Filesystems commonly store numeric UID and GID ownership.

User-space tools map those numbers to names.

Containers and network filesystems can expose mismatches when identity mappings differ.

The displayed username is an interpretation of numeric ownership state.

## Exercise: inspect instead of changing

In a directory you own:

    stat file
    ls -li file
    namei -l /path/to/file

Observe object metadata and path components.

Do not change production permissions just to make an error disappear.

First identify which path component and which identity check fails.

## The lesson to carry forward

Linux file access combines path traversal, names, inodes, credentials, permission bits, and additional security policy.

A permission error is evidence about one failed check in that chain.

Understand the chain before modifying it.
