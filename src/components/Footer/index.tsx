import styles from './styles.module.scss';

export default function Footer(){

    return(
        <footer className={styles.footer}>
            <div className={styles.direitos}>
                <p>@Copyright 2022 | ATMA SOLUÇÕES EM ATENDIMENTO. Todos os direitos reservados.</p>
            </div>
        </footer>
    )
}