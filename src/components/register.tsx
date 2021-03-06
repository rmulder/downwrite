import { useFormik } from "formik";
import UIInput, { UIInputError, UIInputContainer } from "./ui-input";
import { Button } from "./button";
import LegalBoilerplate from "./legal-boilerplate";
import { useLoginFns, IRegisterValues } from "../hooks";
import { RegisterFormSchema as validationSchema } from "../utils/validations";

interface IInput {
  name: string;
  type: string;
  placeholder: string;
  label: string;
  autoComplete: string;
}

const REGISTER_INPUTS: IInput[] = [
  {
    name: "username",
    label: "Username",
    placeholder: "Try for something unique",
    type: "text",
    autoComplete: "username"
  },
  {
    name: "email",
    type: "email",
    placeholder: "mail@email.com",
    label: "Email",
    autoComplete: "email"
  },
  {
    name: "password",
    type: "password",
    placeholder: "*********",
    label: "Password",
    autoComplete: "current-password"
  }
];

const initialValues: IRegisterValues = {
  legalChecked: false,
  username: "",
  password: "",
  email: ""
};

export default function RegisterForm(): JSX.Element {
  const { onRegisterSubmit } = useLoginFns();

  const { values, handleChange, handleSubmit, errors } = useFormik<IRegisterValues>({
    initialValues,
    validationSchema,
    validateOnChange: false,
    onSubmit: onRegisterSubmit
  });

  return (
    <form onSubmit={handleSubmit}>
      <div>
        {REGISTER_INPUTS.map((input) => (
          <UIInputContainer key={input.name}>
            <UIInput
              type={input.type}
              placeholder={input.placeholder}
              label={input.label}
              autoComplete={input.autoComplete}
              name={input.name}
              value={values[input.name] as string}
              onChange={handleChange}
            />
            {errors[input.name] && <UIInputError>{errors[input.name]}</UIInputError>}
          </UIInputContainer>
        ))}
      </div>
      <LegalBoilerplate
        name="legalChecked"
        checked={values.legalChecked}
        onChange={handleChange}
      />
      <div className="text-right">
        <UIInputContainer className="text-right">
          <Button
            disabled={!values.legalChecked}
            type="submit"
            data-testid="REGISTER_BUTTON">
            Register
          </Button>
        </UIInputContainer>
      </div>
    </form>
  );
}
