import React, { ChangeEvent, FunctionComponent, InputHTMLAttributes } from "react";

import Button from "../Button/Button";
import InputText from "../InputText/InputText";
import $ from "./Form.module.css";

interface FormEntry {
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  // TODO: Defined a suitable type for extra props
  // This type should cover all different of attribute types
  extraProps?: InputHTMLAttributes<HTMLInputElement>;
}

interface FormProps {
  label: string;
  loading: boolean;
  formEntries: FormEntry[];
  onFormSubmit: (e: React.ChangeEvent<HTMLFormElement>) => void;
  submitText: string;
}

const Form: FunctionComponent<FormProps> = ({
  label,
  loading,
  formEntries,
  onFormSubmit,
  submitText,
}) => {
  return (
    <form onSubmit={onFormSubmit}>
      <fieldset>
        <legend>{label}</legend>
        {formEntries.map(
          ({ name, placeholder, value, onChange, ...extraProps }, index) => (
            <div key={`${name}-${index}`} className={$.formRow}>
              <InputText
                value={value}
                key={`${name}-${index}`}
                name={name}
                placeholder={placeholder}
                onChange={onChange}
                {...extraProps}
              />
            </div>
          )
        )}

        <Button loading={loading} type="submit">
          {submitText}
        </Button>
      </fieldset>
    </form>
  );
};

export default Form;
