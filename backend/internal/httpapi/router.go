package httpapi

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/example/ticket-system/backend/internal/service"
)

func NewRouter(auth *service.AuthService, tickets *service.TicketService, origins []string, logger *slog.Logger) http.Handler {
	mux := http.NewServeMux()
	authHandler := NewAuthHandler(auth)
	ticketHandler := NewTicketHandler(tickets)

	mux.HandleFunc("GET /health", func(w http.ResponseWriter, _ *http.Request) {
		writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})
	mux.HandleFunc("POST /auth/register", authHandler.Register)
	mux.HandleFunc("POST /auth/login", authHandler.Login)
	mux.Handle("POST /tickets", requireAuth(auth, http.HandlerFunc(ticketHandler.Create)))
	mux.Handle("GET /tickets", requireAuth(auth, http.HandlerFunc(ticketHandler.List)))
	mux.Handle("GET /tickets/{id}", requireAuth(auth, http.HandlerFunc(ticketHandler.Get)))
	mux.Handle("PATCH /tickets/{id}/status", requireAuth(auth, http.HandlerFunc(ticketHandler.UpdateStatus)))

	return withRecovery(logger, withLogging(logger, withSecurityHeaders(withCORS(origins, mux))))
}

func writeServiceError(w http.ResponseWriter, err error) {
	switch {
	case errors.Is(err, service.ErrInvalidTransition):
		writeError(w, http.StatusConflict, "invalid_transition", err.Error())
	case errors.Is(err, service.ErrInvalidInput):
		writeError(w, http.StatusBadRequest, "invalid_input", err.Error())
	case errors.Is(err, service.ErrUnauthorized):
		writeError(w, http.StatusUnauthorized, "unauthorized", "authentication failed")
	case errors.Is(err, service.ErrNotFound):
		writeError(w, http.StatusNotFound, "not_found", "ticket not found")
	default:
		writeError(w, http.StatusBadGateway, "upstream_error", "the data service is unavailable")
	}
}

