# Lesson 52: Video Streaming Architecture

A streaming service stores media, prepares renditions for different devices and networks, and delivers segments close to viewers. Playback should not route every media byte through the application server.

## Upload and processing

Upload the source to object storage. An asynchronous pipeline validates it, transcodes renditions, generates thumbnails, and writes a manifest. Track job status and retry failures.

## Adaptive renditions

Prepare several resolutions and bitrates. Adaptive streaming lets a player choose segments based on bandwidth and buffer health. Transcoding consumes substantial compute and should run outside the request path.

## Object storage and CDN

Store immutable segments in object storage and cache them at CDN edges. The origin handles cache misses rather than every playback request. Use expiring signed URLs for restricted content.

## Playback quality

Measure startup time, rebuffering, quality, and seek latency. Segment duration, CDN placement, manifest design, and player behavior all affect experience.

## Cost and content protection

Storage, transcoding, and bandwidth can dominate cost. Validate uploads, enforce authorization, and monitor processing backlog, CDN cache hit rate, origin egress, and playback errors.

## Key Takeaways

Use asynchronous transcoding, adaptive renditions, object storage, and CDN delivery; optimize viewing quality and delivery cost, not only API latency.

## Practice Exercise

Draw source upload, transcoding, object storage, CDN, and adaptive playback. Explain why segments should not flow through the main application server.
