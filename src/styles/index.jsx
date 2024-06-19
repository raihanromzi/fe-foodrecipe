import { createTheme } from "@mui/material";

export const theme = createTheme({
  typography: {
    fontFamily: ["Mulish", "sans-serif"].join(","),
  },
});

export const cssReset = `
  * {
    margin: 0;
    padding: 0;
  }
  body,
  html,
  :root {
    height: 100%;
    background-color: #f0f9f9;
  } 
`;

export const FieldWrapper = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: "0.25rem",
  fontSize: "0.875rem",
  lineHeight: "1.25rem",
};

export const LabelText = (hasError) => ({
  color: hasError ? "#ff0000" : "#7f7f7f",
  fontSize: "0.875rem",
  lineHeight: "1.25rem",
});

export const Fieldstyle = {
  height: "35px",
  "& input::placeholder": {
    fontSize: "13px !important", // Tambahkan !important jika diperlukan untuk mengatasi konflik
  },
};

export const errorColor = {
  color: "#ff0000",
};

export const CenterBox = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

export const wrapper = {
  fontFamily: "Mulish, sans-serif",
  margin: "0", // m-0
  display: "flex", // flex
  flexDirection: "column", // flex-col
  alignItems: "center", // items-center
  marginRight: "auto", // mx-auto
  marginLeft: "auto",
  paddingRight: "1rem", // px-4
  paddingLeft: "1rem",
  gap: "0.5rem", // gap-2
  paddingTop: "2.5rem", // py-10
  paddingBottom: "2.5rem",
};

export const formContentWrapper = {
  backgroundColor: "white",
  paddingLeft: "2rem",
  paddingRight: "2rem",
  paddingTop: "1.5rem",
  paddingBottom: "1.5rem",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  alignItems: "center",
};

export const formWrapper = {
  maxWidth: "32rem",
  marginLeft: "auto",
  marginRight: "auto",
  borderRadius: "calc(0.5rem - 2px)",
  width: "100%",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  paddingBottom: "0.5rem",
  backgroundColor: "white",
};

export const formTitleWrapper = {
  backgroundColor: "#f49881",
  paddingTop: "0.5rem", // py-2
  paddingBottom: "0.5rem",
  fontSize: "1.125rem", // text-lg
  lineHeight: "1.75rem",
  color: "white",
  textAlign: "center",
};

export const linkStyle = {
  color: "#f49881",
  fontSize: "0.875rem",
  lineHeight: "1.25rem",
  textDecoration: "none",
  textAlign: "center",
};

export const footerTextStyle = {
  fontSize: "0.875rem",
  lineHeight: "1.25rem",
  textDecoration: "none",
};

export const footerStyle = (isMediumDevice) => ({
  width: "100%",
  paddingBottom: "0.25rem",
  display: "flex",
  alignItems: "center",
  flexDirection: isMediumDevice ? "row" : "column",
  justifyContent: "center",
  gap: "0.5rem",
});

export const FooterLink = {
  display: "flex",
  justifyContent: "center",
  gap: "5rem",
};
