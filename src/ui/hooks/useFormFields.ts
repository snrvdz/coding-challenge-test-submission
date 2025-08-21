import { useState } from "react";

export default function useFormFields() {
  const [fields, setFields] = useState({
    postCode: "",
    houseNumber: "",
    firstName: "",
    lastName: "",
    selectedAddress: "",
  });

  function onFieldChange({
    fieldName,
    fieldValue,
  }: {
    fieldName: string;
    fieldValue: HTMLInputElement["value"];
  }) {
    setFields((prev) => ({ ...prev, [fieldName]: fieldValue }));
  }

  return {
    onFieldChange,
    fields,
  };
}
