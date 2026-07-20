# MongoDB Index Design TODO (Backend Checklist)

## Phase 1 — Analyze Every Endpoint

For every controller ask:

* [ ] Which fields are used in `find()`?
* [ ] Which fields are used in `$match`?
* [ ] Which fields are used in `sort()`?
* [ ] Which fields are arrays?
* [ ] Which fields are used for joins (`$lookup`)?
* [ ] Is pagination used?
* [ ] Is this endpoint called frequently?

---

# Phase 2 — Decide if an Index is Needed

For every queried field ask:

* [ ] Is this queried frequently?
* [ ] Is this query performance critical?
* [ ] Is the collection expected to become large?
* [ ] Will indexing save more read time than it costs in writes?

If YES → Create an index.

---

# Phase 3 — Choose the Correct Index Type

## Single Index

Use when querying ONE field.

Example

```js
Video.find({
    owner:userId
})
```

Checklist

* [ ] Single equality filter
* [ ] Single range query
* [ ] Frequently searched field

Example

```js
{
    owner:1
}
```

---

## Compound Index

Use when filtering/sorting on MULTIPLE fields.

Example

```js
Video.find({
    owner:userId,
    isPublished:true
})
.sort({
    createdAt:-1
})
```

Checklist

* [ ] Multiple filters
* [ ] Filter + Sort
* [ ] Follow ESR Rule
* [ ] Follow Prefix Rule

Example

```js
{
    owner:1,
    isPublished:1,
    createdAt:-1
}
```

---

## Multikey Index

Use for ARRAY fields.

Example

```js
{
    tags:[
        "backend",
        "mongodb"
    ]
}
```

Checklist

* [ ] Querying array elements?
* [ ] Using `$in`
* [ ] Using array equality

Example

```js
{
    tags:1
}
```

---

## Text Index

Checklist

* [ ] Full-text search?
* [ ] Search by title?
* [ ] Search description?

Example

```js
{
    title:"text",
    description:"text"
}
```

---

## TTL Index

Checklist

* [ ] OTP
* [ ] Sessions
* [ ] Password reset tokens
* [ ] Temporary documents

---

## Unique Index

Checklist

* [ ] Username
* [ ] Email
* [ ] One like per user/video
* [ ] One subscription per subscriber/channel

Example

```js
{
    email:1
}
```

with

```js
{
    unique:true
}
```

---

## Partial Index

Checklist

* [ ] Only index active documents?
* [ ] Only published videos?
* [ ] Only verified users?

---

## Geospatial Index

Checklist

* [ ] Maps
* [ ] Nearby search
* [ ] Coordinates

Otherwise don't use.

---

# Phase 4 — Design Compound Indexes

Always ask:

### Equality?

```js
owner
```

↓

### Sort?

```js
createdAt
```

↓

### Range?

```js
views > 100
```

Create

```js
{
    owner:1,
    createdAt:-1,
    views:1
}
```

Remember

```text
Equality

↓

Sort

↓

Range
```

---

# Phase 5 — Check Prefix Rule

Index

```js
{
    owner:1,
    createdAt:-1
}
```

Supports

* [ ] owner
* [ ] owner + createdAt

Does NOT efficiently support

* [ ] createdAt only

---

# Phase 6 — Before Creating an Index Ask

* [ ] Will this API use it often?
* [ ] Is another index already covering this query?
* [ ] Is this index redundant?
* [ ] Does this increase write cost unnecessarily?

---

# Phase 7 — After Creating an Index

Run

```js
.explain("executionStats")
```

Check

* [ ] winningPlan
* [ ] IXSCAN instead of COLLSCAN
* [ ] totalDocsExamined
* [ ] totalKeysExamined
* [ ] executionTimeMillis

---

# Phase 8 — Maintain Indexes

Every few months ask:

* [ ] Is this index still used?
* [ ] Is there a duplicate compound index?
* [ ] Can two indexes become one?
* [ ] Is this slowing writes unnecessarily?

Remove unused indexes.

---

# Typical Indexes for a YouTube Backend

## User

* [ ] `username` → Unique
* [ ] `email` → Unique

---

## Video

* [ ] `owner`
* [ ] `owner + createdAt`
* [ ] `isPublished + createdAt`
* [ ] `tags` → Multikey
* [ ] `title + description` → Text (if full-text search)

---

## Comment

* [ ] `video + createdAt`
* [ ] `owner`

---

## Playlist

* [ ] `owner`
* [ ] `owner + createdAt`

---

## Subscription

* [ ] `subscriber + channel` → Unique Compound
* [ ] `channel`
* [ ] `subscriber`

---

## Like

* [ ] `user + video` → Unique Compound
* [ ] `video`
* [ ] `comment` *(if comments can be liked)*

---

## Watch History

* [ ] `user + watchedAt`

---

# Golden Rules

Before creating any index, ask:

* [ ] What query is this index for?
* [ ] How often will this query run?
* [ ] Can an existing index already satisfy it?
* [ ] Would a compound index be better than multiple single indexes?
* [ ] Am I following ESR?
* [ ] Am I following the Prefix Rule?
* [ ] Did I verify the improvement with `explain()`?

**Final Principle:** Never create an index "just in case." Every index should exist because it accelerates one or more real, frequently executed queries while providing more benefit than its cost in storage and write performance.
