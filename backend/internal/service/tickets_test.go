package service

import (
	"context"
	"testing"

	"github.com/example/ticket-system/backend/internal/domain"
)

type ticketRepositoryStub struct {
	ticket domain.Ticket
	status domain.TicketStatus
}

func (s *ticketRepositoryStub) Create(_ context.Context, _, title, description string) (domain.Ticket, error) {
	return domain.Ticket{Title: title, Description: description, Status: domain.StatusOpen}, nil
}
func (s *ticketRepositoryStub) List(context.Context, string) ([]domain.Ticket, error) {
	return []domain.Ticket{s.ticket}, nil
}
func (s *ticketRepositoryStub) Get(context.Context, string, string) (domain.Ticket, error) {
	return s.ticket, nil
}
func (s *ticketRepositoryStub) UpdateStatus(_ context.Context, _, _ string, status domain.TicketStatus) (domain.Ticket, error) {
	s.status = status
	s.ticket.Status = status
	return s.ticket, nil
}

func TestUpdateStatusRejectsReopeningClosedTicket(t *testing.T) {
	repository := &ticketRepositoryStub{ticket: domain.Ticket{ID: "ticket-1", Status: domain.StatusClosed}}
	ticketService := NewTicketService(repository)

	_, err := ticketService.UpdateStatus(context.Background(), "token", "ticket-1", domain.StatusOpen)
	if err == nil {
		t.Fatal("expected closed ticket reopening to fail")
	}
}

func TestCreateTrimsInput(t *testing.T) {
	repository := &ticketRepositoryStub{}
	ticketService := NewTicketService(repository)

	ticket, err := ticketService.Create(context.Background(), "token", "  Broken export  ", " details ")
	if err != nil {
		t.Fatalf("Create returned error: %v", err)
	}
	if ticket.Title != "Broken export" || ticket.Description != "details" {
		t.Fatalf("unexpected normalized ticket: %#v", ticket)
	}
}

