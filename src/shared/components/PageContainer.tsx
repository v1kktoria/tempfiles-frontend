import { Container, ContainerProps } from "@mui/material";
import { styled } from "@mui/material/styles";

export const PageContainer = styled(Container)<ContainerProps>(({ theme }) => ({
  minHeight: "100vh",
  padding: theme.spacing(4, 2),
  display: "flex",
  flexDirection: "column",
}));
