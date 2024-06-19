import Button from "@mui/material/Button";

export function BlueButton({ text, customStyle, type, url }) {
  return (
    <Button
      style={customStyle}
      sx={{
        fontSize: "14px",
        backgroundColor: "#01BFBF",
        textTransform: "none",
      }}
      type={type}
      {...(type === "submit" ? null : { href: url })}
      variant="contained">
      {text}
    </Button>
  );
}
