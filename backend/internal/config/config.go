package config

import (
	"errors"
	"os"
	"strconv"
	"strings"
	"time"
)

type Config struct {
	Port            string
	SupabaseURL     string
	SupabaseAnonKey string
	AllowedOrigins  []string
	HTTPTimeout     time.Duration
}

func Load() (Config, error) {
	timeoutSeconds := 10
	if raw := strings.TrimSpace(os.Getenv("HTTP_TIMEOUT_SECONDS")); raw != "" {
		value, err := strconv.Atoi(raw)
		if err != nil || value < 1 {
			return Config{}, errors.New("HTTP_TIMEOUT_SECONDS must be a positive integer")
		}
		timeoutSeconds = value
	}

	cfg := Config{
		Port:            valueOrDefault("PORT", "8080"),
		SupabaseURL:     strings.TrimRight(strings.TrimSpace(os.Getenv("SUPABASE_URL")), "/"),
		SupabaseAnonKey: strings.TrimSpace(os.Getenv("SUPABASE_ANON_KEY")),
		AllowedOrigins:  splitCSV(valueOrDefault("ALLOWED_ORIGINS", "http://localhost:5173")),
		HTTPTimeout:     time.Duration(timeoutSeconds) * time.Second,
	}

	if cfg.SupabaseURL == "" || cfg.SupabaseAnonKey == "" {
		return Config{}, errors.New("SUPABASE_URL and SUPABASE_ANON_KEY are required")
	}
	return cfg, nil
}

func valueOrDefault(key, fallback string) string {
	if value := strings.TrimSpace(os.Getenv(key)); value != "" {
		return value
	}
	return fallback
}

func splitCSV(value string) []string {
	parts := strings.Split(value, ",")
	result := make([]string, 0, len(parts))
	for _, part := range parts {
		if origin := strings.TrimSpace(part); origin != "" {
			result = append(result, origin)
		}
	}
	return result
}

