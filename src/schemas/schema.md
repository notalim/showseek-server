# Application Data Schema

## Overview
This document outlines the primary data structures used within the Movie/TV Show Suggestion App. The data is stored in Firebase and integrates with the Letterboxd API for media details.

---

### Media
Represents both movies and TV shows available in the app. Each media item can either be a movie or a TV show, differentiated by the `mediatype` field.

#### Fields:

```plaintext
{
    "id": "<provided by Firebase>",
    "letterboxdId": "<provided by Letterboxd API>",
    "letterboxdMediaUrl": "<URL provided by Letterboxd API>",
    "title": "<provided by Letterboxd API>",
    "mediatype": "movie" | "show",
    "dateOfRelease": "<initial release date provided by Letterboxd API>",
    "imgUrl": "<image URL provided by Letterboxd API>",
    "genres": ["<array of genres>"],
    "description": "<brief description or synopsis provided by Letterboxd API>",
    ...
}
```

### User 

Represents a user of the app. Each user has a unique ID provided by Firebase and a unique username chosen by the user.

```plaintext
{
    "id": "<provided by Firebase>",
    "letterboxdId": "<provided by Letterboxd API>",
    "letterboxdProfileUrl": "<URL provided by Letterboxd API>",
    "username": "<chosen by the user>",
    "password": "<hashed provided by the user>",
    "name": "<provided by the user>",
    "imgUrl": "<image URL provided by the user>",
    "watchedMedia": ["<list of media IDs watched, provided by Firebase>"],
    "preferences": {
        "genresLiked": ["<list of preferred genres>"],
        "filmsLiked": ["<list of liked film IDs>"],
        "showsLiked": ["<list of liked show IDs>"],
        "actorsLiked": ["<list of liked actor names>"]
    },
    ...
}

