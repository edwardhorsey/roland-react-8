import React from "react";
import styles from "./FXButton.module.scss";

function FXButton({
    dist,
    logic,
    text,
}: {
    dist: boolean;
    logic: () => void;
    text: string;
}) {
    return (
        <div
            className={
                dist
                    ? `${styles.FXButton ?? ""} ${styles.on ?? ""}`
                    : `${styles.FXButton ?? ""} ${styles.off ?? ""}`
            }
            onClick={logic}
        >
            <h3>{text}</h3>
        </div>
    );
}

export default FXButton;
