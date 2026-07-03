package service

import (
	"context"
	"fmt"
	"strings"

	"github.com/example/ticket-system/backend/internal/domain"
)

type TicketRepository interface {
	Create(ctx context.Context, token, title, description string) (domain.Ticket, error)
	List(ctx context.Context, token string) ([]domain.Ticket, error)
	Get(ctx context.Context, token, id string) (domain.Ticket, error)
	UpdateStatus(ctx context.Context, token, id string, status domain.TicketStatus) (domain.Ticket, error)
}

type TicketService struct {
	repository TicketRepository
}

func NewTicketService(repository TicketRepository) *TicketService {
	return &TicketService{repository: repository}
}

func (s *TicketService) Create(ctx context.Context, token, title, description string) (domain.Ticket, error) {
	title = strings.TrimSpace(title)
	description = strings.TrimSpace(description)
	if title == "" || len(title) > 160 {
		return domain.Ticket{}, fmt.Errorf("%w: title is required and must not exceed 160 characters", ErrInvalidInput)
	}
	if len(description) > 5000 {
		return domain.Ticket{}, fmt.Errorf("%w: description must not exceed 5000 characters", ErrInvalidInput)
	}
	return s.repository.Create(ctx, token, title, description)
}

func (s *TicketService) List(ctx context.Context, token string) ([]domain.Ticket, error) {
	return s.repository.List(ctx, token)
}

func (s *TicketService) Get(ctx context.Context, token, id string) (domain.Ticket, error) {
	if strings.TrimSpace(id) == "" {
		return domain.Ticket{}, ErrNotFound
	}
	return s.repository.Get(ctx, token, id)
}

func (s *TicketService) UpdateStatus(ctx context.Context, token, id string, status domain.TicketStatus) (domain.Ticket, error) {
	if !status.IsValid() {
		return domain.Ticket{}, fmt.Errorf("%w: status must be open, in_progress, or closed", ErrInvalidInput)
	}

	ticket, err := s.repository.Get(ctx, token, id)
	if err != nil {
		return domain.Ticket{}, err
	}
	if !domain.CanTransition(ticket.Status, status) {
		return domain.Ticket{}, fmt.Errorf("%w: %s cannot move to %s", ErrInvalidTransition, ticket.Status, status)
	}
	return s.repository.UpdateStatus(ctx, token, id, status)
}

