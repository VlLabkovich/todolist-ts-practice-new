import Button from "@mui/material/Button"
import { Link } from "react-router"

export const Faq = () => {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Todolist IT-INCUBATOR</h1>
      <h2>Created by Frontend Developer - Labkovich Vladislav</h2>
      <Button component={Link} to="/" variant="contained">
        ВЕРНУТЬСЯ НА ГЛАВНУЮ
      </Button>
    </div>
  )
}
