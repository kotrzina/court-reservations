## Backend

Backend part of court reservation system written in [Go][1] using [Firebase
database][2].

## How to run Firebase locally

Firebase emulator will be running on localhost on port 8080.

```bash
docker run \     
  --env "FIRESTORE_PROJECT_ID=court" \
  --env "PORT=8080" \
  --publish 8080:8080 \
  mtlynch/firestore-emulator-docker
```

## Configuration

| Environment variable              | Description                      | Type   | Required | Default      |
|-----------------------------------|----------------------------------|--------|----------|--------------|
| PORT                              | Application port                 | int    | false    | 8081         |
| GOOGLE_PROJECT_ID                 | Google Project ID                | string | false    | test         |
| MAX_DAYS                          | Max registration ahead in days   | int    | false    | 14           |
| MAX_FRAMES                        | Max possible registration length | int    | false    | 4            |
| SLOT_START                        | Index of first registration slot | int    | false    | 12           |
| SLOT_END                          | Index of last registration slot  | int    | false    | 43           |
| JWT_SIGNING_KEY                   | JWT signing key                  | string | false    | test         |
| REGISTRATION_CODE                 | Password used for registration   | string | false    | test         |
| ADMINS                            | List of users separated by comma | string | false    |              |
| FIRESTORE_COLLECTION_RESERVATIONS | Name of reservation collection   | string | false    | reservations |
| FIRESTORE_COLLECTION_USERS        | Name of user collection          | string | false    | users        |

```bash
# Development variables
export FIRESTORE_EMULATOR_HOST=localhost:8080
export ADMINS=admin
```

[1]: https://go.dev/

[2]: https://firebase.google.com/docs/firestore
