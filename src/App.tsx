import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import InputText from "@/components/InputText/InputText";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";
import useFormFields from "@/hooks/useFormFields";
import ErrorMessage from "@/components/Error/ErrorMessage";
import transformAddress, { RawAddressModel } from "./core/models/address";
import Form from "@/components/Form/Form";

const BASE_URL = process.env.NEXT_PUBLIC_URL || "";

function App() {
  /**
   * Form fields states
   * TODO: Write a custom hook to set form fields in a more generic way:
   * - Hook must expose an onChange handler to be used by all <InputText /> and <Radio /> components
   * - Hook must expose all text form field values, like so: { postCode: '', houseNumber: '', ...etc }
   * - Remove all individual React.useState
   * - Remove all individual onChange handlers, like handlePostCodeChange for example
   */
  const {
    fields: { postCode, houseNumber, firstName, lastName, selectedAddress },
    onFieldChange,
    onFieldsClear,
  } = useFormFields();
  /**
   * Results states
   */
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  /**
   * Redux actions
   */
  const { addAddress, removeAllAddress } = useAddressBook();

  /** TODO: Fetch addresses based on houseNumber and postCode using the local BE api
   * - Example URL of API: ${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=1345&streetnumber=350
   * - Ensure you provide a BASE URL for api endpoint for grading purposes!
   * - Handle errors if they occur
   * - Handle successful response by updating the `addresses` in the state using `setAddresses`
   * - Make sure to add the houseNumber to each found address in the response using `transformAddress()` function
   * - Ensure to clear previous search results on each click
   * - Bonus: Add a loading state in the UI while fetching addresses
   */
  const handleAddressSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("hello: ", postCode, houseNumber);
    resetFormStatus();
    setLoading(true);

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/getAddresses?postcode=${postCode}&streetnumber=${houseNumber}`
        );
        const responseJson = await response.json();

        if (responseJson.status === "error")
          setError(responseJson.errormessage);
        else {
          const transformedAddress = responseJson.details.map(
            (address: RawAddressModel) => transformAddress(address)
          );

          setAddresses(transformedAddress);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  };

  const resetFormStatus = () => {
    setError(undefined);
    setAddresses([]);
  };

  const clearAllFields = () => {
    resetFormStatus();
    onFieldsClear();
    removeAllAddress();
  };

  /** TODO: Add basic validation to ensure first name and last name fields aren't empty
   * Use the following error message setError("First name and last name fields mandatory!")
   */
  const handlePersonSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }

    if (!firstName || !lastName) {
      setError("First name and last name fields mandatory!");
      return;
    }

    const foundAddress = addresses.find(
      (address) => address.id === selectedAddress
    );

    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    setError(undefined);
    addAddress({ ...foundAddress, firstName, lastName });
  };

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        <Form
          label={"🏠 Find an address"}
          loading={loading}
          formEntries={[
            {
              name: "postCode",
              placeholder: "Post Code",
              value: postCode,
              onChange: (e: { target: { value: string } }) => {
                onFieldChange({
                  fieldName: "postCode",
                  fieldValue: e.target.value,
                });
              },
            },
            {
              name: "houseNumber",
              placeholder: "House number",
              value: houseNumber,
              onChange: (e: { target: { value: string } }) => {
                onFieldChange({
                  fieldName: "houseNumber",
                  fieldValue: e.target.value,
                });
              },
            },
          ]}
          onFormSubmit={handleAddressSubmit}
          submitText={"Find"}
        />
        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                onChange={(e) =>
                  onFieldChange({
                    fieldName: "selectedAddress",
                    fieldValue: e.target.value,
                  })
                }
              >
                <Address {...address} />
              </Radio>
            );
          })}
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        {selectedAddress && (
          <Form
            label={"✏️ Add personal info to address"}
            loading={loading}
            formEntries={[
              {
                name: "firstName",
                placeholder: "First name",
                value: firstName,
                onChange: (e: { target: { value: string } }) => {
                  onFieldChange({
                    fieldName: "firstName",
                    fieldValue: e.target.value,
                  });
                },
              },
              {
                name: "lastName",
                placeholder: "Last name",
                value: lastName,
                onChange: (e: { target: { value: string } }) => {
                  onFieldChange({
                    fieldName: "lastName",
                    fieldValue: e.target.value,
                  });
                },
              },
            ]}
            onFormSubmit={handlePersonSubmit}
            submitText={"Add to addressbook"}
          />
        )}

        {/* TODO: Create an <ErrorMessage /> component for displaying an error message */}
        {error && <ErrorMessage errorMessage={error} />}

        {/* TODO: Add a button to clear all form fields. 
        Button must look different from the default primary button, see design. 
        Button text name must be "Clear all fields"
        On Click, it must clear all form fields, remove all search results and clear all prior
        error messages
        */}
        <Button onClick={clearAllFields} variant="outline">
          Clear all fields
        </Button>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
