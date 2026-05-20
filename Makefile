.PHONY: up down logs seed build test lint test-backend test-frontend lint-backend lint-frontend build-frontend deploy clean

# --- Docker / dev loop ------------------------------------------------------
up:
	docker compose up --build -d

down:
	docker compose down

logs:
	docker compose logs -f

seed:
	docker compose exec backend python scripts/seed.py

# --- Tests ------------------------------------------------------------------
test: test-backend test-frontend

test-backend:
	cd backend && pytest -q

test-frontend:
	cd frontend && npm test

# --- Lint -------------------------------------------------------------------
lint: lint-backend lint-frontend

lint-backend:
	cd backend && ruff check .

lint-frontend:
	cd frontend && npm run lint

# --- Build ------------------------------------------------------------------
build: build-frontend

build-frontend:
	cd frontend && npm run build

# --- Deploy (placeholder — see infra/README.md for the real runbook) --------
deploy:
	@echo "See infra/README.md for the deployment runbook."
	@echo "CI deploys on push to main via .github/workflows/deploy.yml"

# --- Cleanup ----------------------------------------------------------------
clean:
	rm -rf backend/.pytest_cache frontend/.next frontend/coverage backend/__pycache__
