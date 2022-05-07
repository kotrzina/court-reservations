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

[1]: https://go.dev/
[2]: https://firebase.google.com/docs/firestore
