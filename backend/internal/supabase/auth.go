package supabase

import (
	"context"
	"errors"
	"net/http"

	"github.com/example/ticket-system/backend/internal/domain"
	"github.com/example/ticket-system/backend/internal/service"
)

type authResponse struct {
	AccessToken  string      `json:"access_token"`
	RefreshToken string      `json:"refresh_token"`
	ExpiresIn    int         `json:"expires_in"`
	User         domain.User `json:"user"`
}

func (c *Client) Register(ctx context.Context, email, password string) (domain.Session, error) {
	var response authResponse
	err := c.do(ctx, http.MethodPost, "/auth/v1/signup", "", map[string]string{
		"email": email, "password": password,
	}, nil, &response)
	if err != nil {
		if apiErr, ok := err.(*APIError); ok && apiErr.StatusCode >= 400 && apiErr.StatusCode < 500 {
			return domain.Session{}, errors.Join(service.ErrInvalidInput, err)
		}
		return domain.Session{}, err
	}
	return response.session(), nil
}

func (c *Client) Login(ctx context.Context, email, password string) (domain.Session, error) {
	var response authResponse
	err := c.do(ctx, http.MethodPost, "/auth/v1/token?grant_type=password", "", map[string]string{
		"email": email, "password": password,
	}, nil, &response)
	if err != nil {
		return domain.Session{}, mapAuthError(err)
	}
	return response.session(), nil
}

func (c *Client) ValidateToken(ctx context.Context, token string) (domain.User, error) {
	var user domain.User
	if err := c.do(ctx, http.MethodGet, "/auth/v1/user", token, nil, nil, &user); err != nil {
		return domain.User{}, service.ErrUnauthorized
	}
	return user, nil
}

func (r authResponse) session() domain.Session {
	return domain.Session{
		User: r.User, Token: r.AccessToken, AccessToken: r.AccessToken,
		RefreshToken: r.RefreshToken, ExpiresIn: r.ExpiresIn,
	}
}

func mapAuthError(err error) error {
	if apiErr, ok := err.(*APIError); ok && (apiErr.StatusCode == http.StatusBadRequest || apiErr.StatusCode == http.StatusUnauthorized) {
		return service.ErrUnauthorized
	}
	return err
}
