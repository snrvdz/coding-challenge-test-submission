import { useState } from "react";

const initialFieldValues = {
  postCode: "",
  houseNumber: "",
  firstName: "",
  lastName: "",
  selectedAddress: "",
};

export default function useFormFields() {
  const [fields, setFields] = useState(initialFieldValues);

  function onFieldChange({
    fieldName,
    fieldValue,
  }: {
    fieldName: string;
    fieldValue: HTMLInputElement["value"];
  }) {
    setFields((prev) => ({ ...prev, [fieldName]: fieldValue }));
  }

  function onFieldsClear() {
    setFields(initialFieldValues);
  }

  return {
    fields,
    onFieldChange,
    onFieldsClear,
  };
}
