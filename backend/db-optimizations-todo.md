# YouTube Backend Database Optimization TODO

## Phase 1 — Analyze Every Read Endpoint

For every controller, answer:

* [ ] What collections does this endpoint touch?
* [ ] How many `$lookup`s does it perform?
* [ ] Which data is only displayed?
* [ ] Which data changes frequently?
* [ ] Can this endpoint be satisfied with one collection?

---

## Phase 2 — Cache (Denormalize) Stable Data

### Video Collection

Instead of only

```js
owner: ObjectId
```

consider adding

* [ ] `ownerSnapshot.username`
* [ ] `ownerSnapshot.avatar`

Goal:

* [ ] Remove `$lookup` for owner on video pages.

---

### Comment Collection

Instead of only

```js
owner: ObjectId
```

consider adding

* [ ] `ownerSnapshot.username`
* [ ] `ownerSnapshot.avatar`

Goal:

* [ ] Show comments without looking up every user.

---

### Playlist Collection

Instead of only

```js
owner: ObjectId
```

consider adding

* [ ] `ownerSnapshot.username`
* [ ] `ownerSnapshot.avatar`

---

## Phase 3 — Cache Counters

### User

Instead of calculating every time

* [ ] `stats.subscribersCount`
* [ ] `stats.subscriptionsCount`
* [ ] `stats.videosCount`
* [ ] `stats.totalViews` *(optional)*

Goal:

* [ ] Avoid `$lookup + $group + $count`

---

### Video

Instead of aggregating

* [ ] `likesCount`
* [ ] `commentsCount`

Already have

* [x] `views`

Goal:

* [ ] Never aggregate just to display counts.

---

### Playlist

* [ ] `videosCount`

Instead of

```text
playlist.videos.length
```

or aggregation.

---

## Phase 4 — Decide What Should Stay Normalized

Do **NOT** duplicate fields that change frequently.

Ask for every field:

* [ ] Is it read much more often than written?
* [ ] Does it rarely change?
* [ ] Is duplication worth removing a `$lookup`?

If **No**, keep only an ObjectId reference.

---

## Phase 5 — Remove Expensive Aggregations

Review every controller.

For each `$lookup`, ask:

* [ ] Can cached data replace this lookup?
* [ ] Is this aggregation only calculating a count?
* [ ] Can the count be stored instead?
* [ ] Can this endpoint become a simple `.find()`?

Goal:

```text
Aggregate

↓

Find()
```

whenever practical.

---

## Phase 6 — Maintain Cached Fields

Whenever data changes, update all cached copies.

Examples:

### User changes username

* [ ] Update `User`
* [ ] Update `Video.ownerSnapshot`
* [ ] Update `Comment.ownerSnapshot`
* [ ] Update `Playlist.ownerSnapshot`

---

### Subscribe

* [ ] Create Subscription
* [ ] Increment `channel.stats.subscribersCount`
* [ ] Increment `subscriber.stats.subscriptionsCount`

---

### Unsubscribe

* [ ] Delete Subscription
* [ ] Decrement cached counters

---

### Publish Video

* [ ] Create Video
* [ ] Cache owner snapshot
* [ ] Increment `user.stats.videosCount`

---

### Delete Video

* [ ] Delete Video
* [ ] Decrement `user.stats.videosCount`

---

### Like Video

* [ ] Create Like
* [ ] Increment `video.likesCount`

---

### Unlike Video

* [ ] Delete Like
* [ ] Decrement `video.likesCount`

---

### Add Comment

* [ ] Create Comment
* [ ] Cache commenter snapshot
* [ ] Increment `video.commentsCount`

---

### Delete Comment

* [ ] Delete Comment
* [ ] Decrement `video.commentsCount`

---

## Phase 7 — Add Proper Indexes

Review every endpoint.

For each query ask:

* [ ] What fields are filtered?
* [ ] What fields are sorted?
* [ ] Is this an array?
* [ ] Should this be Single, Compound or Multikey?

---

## Phase 8 — Migrations

Whenever the schema changes:

* [ ] Update `*.model.js`
* [ ] Write a migration script
* [ ] Run it once
* [ ] Update controllers/services to maintain the new fields
* [ ] Commit migration + schema changes

---

## Final Goal

Every endpoint should be evaluated with these questions:

* [ ] Can this request avoid aggregation?
* [ ] Can this request avoid `$lookup`?
* [ ] Can this request be served from one collection?
* [ ] Is this optimized for reads?
* [ ] Are cached fields maintained correctly on writes?
* [ ] Are indexes designed for the query pattern?

**Target mindset:** Optimize for the common read path while keeping writes responsible for maintaining cached and denormalized data.
