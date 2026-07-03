package service

import "errors"

var (
	ErrInvalidInput      = errors.New("invalid input")
	ErrUnauthorized      = errors.New("unauthorized")
	ErrNotFound          = errors.New("ticket not found")
	ErrInvalidTransition = errors.New("invalid ticket status transition")
)

