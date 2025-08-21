import { FunctionComponent } from "react";
import $ from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  errorMessage: string;
}

const ErrorMessage: FunctionComponent<ErrorMessageProps> = ({
  errorMessage,
}) => {
  return <div className={$.error}>{errorMessage}</div>;
};

export default ErrorMessage;
