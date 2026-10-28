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

## Learning Objectives

- Describe upload, transcoding, storage, CDN, and playback stages.

- Explain adaptive bitrate streaming and segment delivery.

- Balance playback quality, latency, storage, and delivery cost.

## Worked Example

A video uploaded in one high-bitrate format must play on phones with varying network speeds.

**Reasoning:** Store the source, transcode asynchronously into multiple renditions and segments, publish a manifest, and serve segments from object storage through a CDN. The player adapts rendition to available bandwidth and buffer health.

## Check Your Understanding

Why should video segments usually be delivered through a CDN rather than the main application server?

- A. A CDN eliminates the need to store video.

- B. It distributes cached media closer to viewers and reduces repeated origin load.

- C. It guarantees no playback failures.

**Answer and explanation:** B — CDNs improve geographic delivery and absorb repeated reads; origin storage and monitoring are still required.

## Common Pitfall

Serving all large media bytes through application workers, exhausting resources needed for API traffic.

## Practice Hint

Trace source upload through processing and manifest publication, then trace playback and cache misses.

## Self-Check

Can you explain how transcoding, manifests, adaptive bitrate, object storage, and CDN fit together?

## Key Takeaways

Use asynchronous transcoding, adaptive renditions, object storage, and CDN delivery; optimize viewing quality and delivery cost, not only API latency.

## Practice Exercise

Draw source upload, transcoding, object storage, CDN, and adaptive playback. Explain why segments should not flow through the main application server.
