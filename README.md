## Overview

An app for logging data with inline-editing and creation.

**Requirements**

- On page load, user sees the most recent session with all logs
- If a log exists, any edits are persisted on blur
- If a log does not exist, it is lost on refresh.
- A "log" button persists the entire session. In reality, this just means new logs are created for the session, since any other edits on existing logs happen on blur.
- A user can create a "new" session, which will have 0 logs

**Constraints**

In order to simulate a particular project, there will be some constraints:

- No single API gives the data as needed by the page. Cannot combine APIs in an API. It has to be done clientside
- All data is requested via the UI and formatted on the client :(

## Motivation

To see if data can flow in an easy-to-understand way.

## Technologies

- next.js - react framework
- shadcn - ui components
- react-query - syncing server data
- drizzle - ORM around a simple sqlite db
