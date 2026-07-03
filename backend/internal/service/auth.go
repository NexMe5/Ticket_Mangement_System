package service

import (
	"context"
	"fmt"
	"net/mail"
	"strings"

	"github.com/example/ticket-system/backend/internal/domain"
)

type AuthProvider interface {
	Register(ctx context.Context, email, password string) (domain.Session, error)
	Login(ctx context.Context, email, password string) (domain.Session, error)
	ValidateToken(ctx context.Context, token string) (domain.User, error)
}

type AuthService struct {
	provider AuthProvider
}

func NewAuthService(provider AuthProvider) *AuthService {
	return &AuthService{provider: provider}
}

func (s *AuthService) Register(ctx context.Context, email, password string) (domain.Session, error) {
	email, err := validateCredentials(email, password)
	if err != nil {
		return domain.Session{}, err
	}
	return s.provider.Register(ctx, email, password)
}

func (s *AuthService) Login(ctx context.Context, email, password string) (domain.Session, error) {
	email, err := validateCredentials(email, password)
	if err != nil {
		return domain.Session{}, err
	}
	return s.provider.Login(ctx, email, password)
}

func (s *AuthService) ValidateToken(ctx context.Context, token string) (domain.User, error) {
	if strings.TrimSpace(token) == "" {
		return domain.User{}, ErrUnauthorized
	}
	return s.provider.ValidateToken(ctx, token)
}

func validateCredentials(email, password string) (string, error) {
	email = strings.ToLower(strings.TrimSpace(email))
	address, err := mail.ParseAddress(email)
	if err != nil || address.Address != email {
		return "", fmt.Errorf("%w: a valid email is required", ErrInvalidInput)
	}
	if len(password) < 6 {
		return "", fmt.Errorf("%w: password must contain at least 6 characters", ErrInvalidInput)
	}
	return email, nil
}
