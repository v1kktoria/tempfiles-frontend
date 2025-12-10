import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

export const AppButton = styled(Button)<ButtonProps>(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  fontWeight: 600,
  fontSize: "1rem",
  textTransform: "none",
  padding: theme.spacing(1, 3),
}));
