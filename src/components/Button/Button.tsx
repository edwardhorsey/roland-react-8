import React from "react";
import styles from "./Button.module.scss";

function Button({ text, logic }: { text: string; logic: () => void }) {
    const btnStyles =
        text === "Clear"
            ? `${styles.button ?? ""} ${styles.clear ?? ""}`
            : styles.button;
    return (
        <div className={btnStyles} onClick={logic}>
            {text}
        </div>
    );
}

export default Button;
