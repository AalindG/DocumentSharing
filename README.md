### Entities
* Document
* User
* AccessControl[OPT]

### Requirements
- User creates a document
- User can provide access for a document
- User can read a document
- User can make changes to a document
- Owner can provide access for a document
- Authorise user before user read, write, share[operations].

### ENUMS
- USER_ACCESS
  - OWNER
  - READ_ONLY
  - WRITE_ACCESS

- OPERATIONS
  - SHARE
  - READ
  - WRITE


#### Operation to userAccess mapping
* OWNER - [All operations]
* READ_ONLY - [READ]
* WRITE_ACCESS - [READ,WRITE]
