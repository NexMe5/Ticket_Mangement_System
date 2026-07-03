package httpapi

import (
	"net/http"

	"github.com/example/ticket-system/backend/internal/domain"
	"github.com/example/ticket-system/backend/internal/service"
)

type TicketHandler struct {
	service *service.TicketService
}

func NewTicketHandler(ticketService *service.TicketService) *TicketHandler {
	return &TicketHandler{service: ticketService}
}

func (h *TicketHandler) Create(w http.ResponseWriter, r *http.Request) {
	var request struct {
		Title       string `json:"title"`
		Description string `json:"description"`
	}
	if err := readJSON(w, r, &request); err != nil {
		writeError(w, http.StatusBadRequest, "invalid_json", "request body must be valid JSON")
		return
	}
	ticket, err := h.service.Create(r.Context(), tokenFromContext(r.Context()), request.Title, request.Description)
	if err != nil {
		writeServiceError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, ticket)
}

func (h *TicketHandler) List(w http.ResponseWriter, r *http.Request) {
	tickets, err := h.service.List(r.Context(), tokenFromContext(r.Context()))
	if err != nil {
		writeServiceError(w, err)
		return
	}
	if tickets == nil {
		tickets = []domain.Ticket{}
	}
	writeJSON(w, http.StatusOK, tickets)
}

func (h *TicketHandler) Get(w http.ResponseWriter, r *http.Request) {
	ticket, err := h.service.Get(r.Context(), tokenFromContext(r.Context()), r.PathValue("id"))
	if err != nil {
		writeServiceError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, ticket)
}

func (h *TicketHandler) UpdateStatus(w http.ResponseWriter, r *http.Request) {
	var request struct {
		Status domain.TicketStatus `json:"status"`
	}
	if err := readJSON(w, r, &request); err != nil {
		writeError(w, http.StatusBadRequest, "invalid_json", "request body must be valid JSON")
		return
	}
	ticket, err := h.service.UpdateStatus(r.Context(), tokenFromContext(r.Context()), r.PathValue("id"), request.Status)
	if err != nil {
		writeServiceError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, ticket)
}

