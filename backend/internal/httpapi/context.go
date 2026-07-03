package httpapi

import (
	"context"

	"github.com/example/ticket-system/backend/internal/domain"
)

type contextKey string

const (
	tokenKey contextKey = "access_token"
	userKey  contextKey = "user"
)

func withAuth(ctx context.Context, token string, user domain.User) context.Context {
	ctx = context.WithValue(ctx, tokenKey, token)
	return context.WithValue(ctx, userKey, user)
}

func tokenFromContext(ctx context.Context) string {
	token, _ := ctx.Value(tokenKey).(string)
	return token
}

