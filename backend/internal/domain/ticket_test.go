package domain

import "testing"

func TestCanTransition(t *testing.T) {
	tests := []struct {
		name string
		from TicketStatus
		to   TicketStatus
		want bool
	}{
		{"open to in progress", StatusOpen, StatusInProgress, true},
		{"in progress to closed", StatusInProgress, StatusClosed, true},
		{"open cannot skip closed", StatusOpen, StatusClosed, false},
		{"closed cannot reopen", StatusClosed, StatusOpen, false},
		{"same status is not a transition", StatusOpen, StatusOpen, false},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			if got := CanTransition(test.from, test.to); got != test.want {
				t.Fatalf("CanTransition(%q, %q) = %v, want %v", test.from, test.to, got, test.want)
			}
		})
	}
}

