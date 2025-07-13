import Button from "@mui/material/Button"
import { Link } from "react-router"
import s from "./faq.module.css"

export const Faq = () => {
  return (
    <div className={s.contact}>
      <h1>Todolist IT-INCUBATOR</h1>
      <h2>Created by Frontend Developer - Labkovich Vladislav</h2>
      <h3>How to contact me:</h3>
      <div className={s.btnLinks}>
        <Button component={Link} to="https://vllabkovich.github.io/my-portfolio-ts/">
          My Portfolio
        </Button>
        <Button component={Link} to="/" variant="contained">
          ВЕРНУТЬСЯ НА ГЛАВНУЮ
        </Button>
      </div>

    </div>
  )
}
