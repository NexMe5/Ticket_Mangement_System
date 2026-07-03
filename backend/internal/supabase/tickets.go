package supabase

import (
	"context"
	"errors"
	"net/http"
	"net/url"

	"github.com/example/ticket-system/backend/internal/domain"
	"github.com/example/ticket-system/backend/internal/service"
)

const ticketFields = "id,user_id,title,description,status,created_at,updated_at"

func (c *Client) Create(ctx context.Context, token, title, description string) (domain.Ticket, error) {
	var tickets []domain.Ticket
	err := c.do(ctx, http.MethodPost, "/rest/v1/tickets?select="+ticketFields, token,
		map[string]string{"title": title, "description": description},
		map[string]string{"Prefer": "return=representation"}, &tickets)
	if err != nil {
		return domain.Ticket{}, mapDataError(err)
	}
	if len(tickets) == 0 {
		return domain.Ticket{}, service.ErrNotFound
	}
	return tickets[0], nil
}

func (c *Client) List(ctx context.Context, token string) ([]domain.Ticket, error) {
	var tickets []domain.Ticket
	err := c.do(ctx, http.MethodGet, "/rest/v1/tickets?select="+ticketFields+"&order=created_at.desc", token, nil, nil, &tickets)
	if err != nil {
		return nil, mapDataError(err)
	}
	return tickets, nil
}

func (c *Client) Get(ctx context.Context, token, id string) (domain.Ticket, error) {
	var tickets []domain.Ticket
	path := "/rest/v1/tickets?select=" + ticketFields + "&id=eq." + url.QueryEscape(id) + "&limit=1"
	if err := c.do(ctx, http.MethodGet, path, token, nil, nil, &tickets); err != nil {
		return domain.Ticket{}, mapDataError(err)
	}
	if len(tickets) == 0 {
		return domain.Ticket{}, service.ErrNotFound
	}
	return tickets[0], nil
}

func (c *Client) UpdateStatus(ctx context.Context, token, id string, status domain.TicketStatus) (domain.Ticket, error) {
	var tickets []domain.Ticket
	path := "/rest/v1/tickets?select=" + ticketFields + "&id=eq." + url.QueryEscape(id)
	err := c.do(ctx, http.MethodPatch, path, token, map[string]domain.TicketStatus{"status": status},
		map[string]string{"Prefer": "return=representation"}, &tickets)
	if err != nil {
		return domain.Ticket{}, mapDataError(err)
	}
	if len(tickets) == 0 {
		return domain.Ticket{}, service.ErrNotFound
	}
	return tickets[0], nil
}

func mapDataError(err error) error {
	var apiErr *APIError
	if errors.As(err, &apiErr) {
		switch apiErr.StatusCode {
		case http.StatusUnauthorized, http.StatusForbidden:
			return service.ErrUnauthorized
		case http.StatusNotFound:
			return service.ErrNotFound
		case http.StatusBadRequest, http.StatusConflict:
			return errors.Join(service.ErrInvalidInput, err)
		}
	}
	return err
}
