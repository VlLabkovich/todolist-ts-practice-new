import Button from "@mui/material/Button"
import { Link } from "react-router"
import styles from "./PageNotFound.module.css"


export const PageNotFound = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',

  }}>
    <h1 className={styles.title}>404</h1>
    <h2 className={styles.subtitle}>page not found</h2>
    <Button component={Link} to='/' variant="contained">
      ВЕРНУТЬСЯ НА ГЛАВНУЮ
    </Button>
  </div>
)
