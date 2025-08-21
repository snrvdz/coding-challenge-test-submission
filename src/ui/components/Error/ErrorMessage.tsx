import { FunctionComponent } from "react";

interface ErrorMessageProps {
  errorMessage: string;
}

const ErrorMessage: FunctionComponent<ErrorMessageProps> = ({ errorMessage }) => {
  return <div className="error">{errorMessage}</div>;
};

export default ErrorMessage;
