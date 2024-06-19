import React from "react";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Typography from "@mui/material/Typography";
import {
  FieldWrapper,
  LabelText,
  Fieldstyle,
  errorColor,
} from "../styles/index.jsx";

export const TextInput = ({ label, fieldName, field, errors }) => {
  return (
    <div style={FieldWrapper}>
      <Typography sx={LabelText(errors[fieldName])}>
        {label} <span style={errorColor}>*</span>
      </Typography>
      <OutlinedInput
        {...field(fieldName)}
        sx={Fieldstyle}
        placeholder={label}
      />
      {errors[fieldName] && (
        <FormHelperText sx={errorColor}>
          {errors[fieldName].message}
        </FormHelperText>
      )}
    </div>
  );
};

export const PasswordInput = ({ label, fieldName, field, errors }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <div style={FieldWrapper}>
      <Typography sx={LabelText(errors[fieldName])}>
        {label} <span style={errorColor}>*</span>
      </Typography>
      <OutlinedInput
        {...field(fieldName)}
        type={showPassword ? "text" : "password"}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end">
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
        placeholder={label}
        sx={Fieldstyle}
      />
      {errors[fieldName] && (
        <FormHelperText sx={errorColor}>
          {errors[fieldName].message}
        </FormHelperText>
      )}
    </div>
  );
};
