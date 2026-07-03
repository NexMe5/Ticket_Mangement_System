package domain

type User struct {
	ID    string `json:"id"`
	Email string `json:"email"`
}

type Session struct {
	User         User   `json:"user"`
	Token        string `json:"token,omitempty"`
	AccessToken  string `json:"access_token,omitempty"`
	RefreshToken string `json:"refresh_token,omitempty"`
	ExpiresIn    int    `json:"expires_in,omitempty"`
}

