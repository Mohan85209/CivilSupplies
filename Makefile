.PHONY: help up down logs build test test-backend test-frontend lint lint-backend lint-frontend build-frontend build-backend clean

help:
	@echo "Civil Supplies — common tasks"
	@echo ""
	@echo "  make up              Bring up the full stack (postgres + redis + backend + frontend)"
	@echo "  make down            Tear down the stack"
	@echo "  make logs            Tail container logs"
	@echo "  make build           Build both frontend and backend artifacts"
	@echo "  make test            Run all tests (backend + frontend)"
	@echo "  make test-backend    Run JUnit/Mockito tests for the Spring Boot API"
	@echo "  make test-frontend   Run Karma/Jasmine tests for the Angular app"
	@echo "  make lint            Run lint for both frontend and backend"
	@echo "  make clean           Remove build artifacts"

# --- Docker / dev loop ------------------------------------------------------
up:
	docker compose up --build -d

down:
	docker compose down

logs:
	docker compose logs -f

# --- Tests ------------------------------------------------------------------
test: test-backend test-frontend

test-backend:
	cd backend && mvn -B -q test

test-frontend:
	cd frontend && npm test -- --watch=false --browsers=ChromeHeadless

# --- Lint -------------------------------------------------------------------
lint: lint-backend lint-frontend

lint-backend:
	cd backend && mvn -B -q -DskipTests verify

lint-frontend:
	cd frontend && npm run lint --if-present

# --- Build ------------------------------------------------------------------
build: build-backend build-frontend

build-backend:
	cd backend && mvn -B -q -DskipTests package

build-frontend:
	cd frontend && npm ci && npm run build

# --- Cleanup ----------------------------------------------------------------
clean:
	rm -rf backend/target frontend/dist frontend/.angular frontend/coverage backend/uploads/*
