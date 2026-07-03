package httpapi

import (
	"context"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/example/ticket-system/backend/internal/domain"
	"github.com/example/ticket-system/backend/internal/service"
)

type providerStub struct{}

func (providerStub) Register(context.Context, string, string) (domain.Session, error) {
	return domain.Session{}, nil
}
func (providerStub) Login(context.Context, string, string) (domain.Session, error) {
	return domain.Session{}, nil
}
func (providerStub) ValidateToken(context.Context, string) (domain.User, error) {
	return domain.User{}, service.ErrUnauthorized
}

func TestHealthContract(t *testing.T) {
	auth := service.NewAuthService(providerStub{})
	tickets := service.NewTicketService(&ticketRepositoryStubForRouter{})
	router := NewRouter(auth, tickets, nil, slog.New(slog.NewTextHandler(io.Discard, nil)))

	request := httptest.NewRequest(http.MethodGet, "/health", nil)
	response := httptest.NewRecorder()
	router.ServeHTTP(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusOK)
	}
	if response.Body.String() != "{\"status\":\"ok\"}\n" {
		t.Fatalf("unexpected body: %s", response.Body.String())
	}
}

func TestProtectedRouteRequiresBearerToken(t *testing.T) {
	auth := service.NewAuthService(providerStub{})
	tickets := service.NewTicketService(&ticketRepositoryStubForRouter{})
	router := NewRouter(auth, tickets, nil, slog.New(slog.NewTextHandler(io.Discard, nil)))

	request := httptest.NewRequest(http.MethodGet, "/tickets", nil)
	response := httptest.NewRecorder()
	router.ServeHTTP(response, request)

	if response.Code != http.StatusUnauthorized {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusUnauthorized)
	}
}

type ticketRepositoryStubForRouter struct{}

func (*ticketRepositoryStubForRouter) Create(context.Context, string, string, string) (domain.Ticket, error) {
	return domain.Ticket{}, nil
}
func (*ticketRepositoryStubForRouter) List(context.Context, string) ([]domain.Ticket, error) {
	return nil, nil
}
func (*ticketRepositoryStubForRouter) Get(context.Context, string, string) (domain.Ticket, error) {
	return domain.Ticket{}, nil
}
func (*ticketRepositoryStubForRouter) UpdateStatus(context.Context, string, string, domain.TicketStatus) (domain.Ticket, error) {
	return domain.Ticket{}, nil
}

