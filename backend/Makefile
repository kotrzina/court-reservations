dev: export FIRESTORE_EMULATOR_HOST=localhost:8080
dev: export ADMINS=admin
dev:
	go run ./...

start-emulator:
	docker run -d --env "FIRESTORE_PROJECT_ID=court" --env "PORT=8080" --publish 8080:8080 mtlynch/firestore-emulator-docker
