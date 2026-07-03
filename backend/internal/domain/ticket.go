package domain

import "time"

type TicketStatus string

const (
	StatusOpen       TicketStatus = "open"
	StatusInProgress TicketStatus = "in_progress"
	StatusClosed     TicketStatus = "closed"
)

type Ticket struct {
	ID          string       `json:"id"`
	UserID      string       `json:"user_id"`
	Title       string       `json:"title"`
	Description string       `json:"description"`
	Status      TicketStatus `json:"status"`
	CreatedAt   time.Time    `json:"created_at"`
	UpdatedAt   time.Time    `json:"updated_at"`
}

func (s TicketStatus) IsValid() bool {
	return s == StatusOpen || s == StatusInProgress || s == StatusClosed
}

func CanTransition(from, to TicketStatus) bool {
	return (from == StatusOpen && to == StatusInProgress) ||
		(from == StatusInProgress && to == StatusClosed)
}

