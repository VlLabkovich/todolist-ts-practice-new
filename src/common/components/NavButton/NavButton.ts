import { styled } from "@mui/material/styles"
import Button, { type ButtonProps } from "@mui/material/Button"
import type { LinkProps } from "react-router"

type CustomProps  = {
  background?: string
}

type Props = ButtonProps & CustomProps & Partial<LinkProps>

export const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "background"
})<Props>(({ background, theme }) => ({
  minWidth: "110px",
  fontWeight: "bold",
  boxShadow: `0 0 0 2px ${theme.palette.primary.dark}, 4px 4px 0 0 ${theme.palette.primary.dark}`,
  borderRadius: "2px",
  textTransform: "capitalize",
  margin: "0 10px",
  padding: "8px 24px",
  color: theme.palette.primary.contrastText,
  background: background || theme.palette.primary.light,
}))
