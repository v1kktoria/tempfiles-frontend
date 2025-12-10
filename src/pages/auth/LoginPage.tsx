import React from "react";
import { ThemeProvider, Typography, Stack, Card, CardContent } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import { theme } from "../../shared/theme/theme";
import { PageContainer } from "../../shared/components/PageContainer";
import { AppButton } from "../../shared/components/AppButton";

export const LoginPage: React.FC = () => {
  const handleLogin = (provider: "google" | "github") => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/${provider}`;
  };

  return (
    <ThemeProvider theme={theme}>
      <PageContainer maxWidth="sm" sx={{ justifyContent: "center" }}>
        <Card sx={{ p: 6, textAlign: "center" }}>
          <CardContent>
            <Stack spacing={4}>
              <Typography variant="h4" fontWeight={700}>
                Вход в аккаунт
              </Typography>
              <Stack spacing={2}>
                <AppButton
                  fullWidth
                  startIcon={<GoogleIcon />}
                  sx={{
                    backgroundColor: "#3367D6",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#254EA3" },
                  }}
                  onClick={() => handleLogin("google")}
                >
                  Войти через Google
                </AppButton>

                <AppButton
                  fullWidth
                  startIcon={<GitHubIcon />}
                  sx={{
                    backgroundColor: "#24292F",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#1B1F23" },
                  }}
                  onClick={() => handleLogin("github")}
                >
                  Войти через GitHub
                </AppButton>
              </Stack>

              <Typography variant="body2" color="text.secondary" mt={3}>
                Используйте ваш аккаунт Google или GitHub для входа в Tempfiles service
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </PageContainer>
    </ThemeProvider>
  );
};

export default LoginPage;
