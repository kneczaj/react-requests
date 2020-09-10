import React from "react";
import {Errors as ErrorModel} from "../models/errors";
import {useHistory} from "react-router";
import { merge } from "../../css";
import { Button } from "@material-ui/core";
import { Centered } from "../../components/centered";

export interface Props {
    value: ErrorModel;
    className?: string;
    showGoBack?: boolean;
    retry?: () => void;
    children?: React.ReactNode;
}

/**
 * Show error to the user, occupies minimum place in height
 */
export function ErrorPlaceholder({ children, value: { messages }, showGoBack, className, retry }: Props): JSX.Element {
    const history = useHistory();
    return (
        <div className={merge(className, 'error-root centered-container text-center')}>
            <Centered>
                {messages.map((message, idx) => <h1 key={idx}>{message}</h1>)}
                {(retry || showGoBack) &&
                <div style={{ marginTop: '1em' }}>
                    {showGoBack && <Button onClick={history.goBack}>Go back</Button>}
                    {retry && <Button onClick={retry}>Retry</Button>}
                </div>}
                {children}
            </Centered>
        </div>
    );
}
