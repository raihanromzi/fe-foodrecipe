import { useMediaQuery } from "@uidotdev/usehooks";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import {
  formWrapper,
  formTitleWrapper,
  linkStyle,
  footerTextStyle,
  footerStyle,
  FooterLink,
} from "../styles/index.jsx";

const AuthWrapper = ({
  children,
  title,
  linkText,
  url,
  footerText,
  showAboutAndContact,
}) => {
  const isMediumDevice = useMediaQuery("only screen and (min-width : 768px)");

  return (
    <Box sx={formWrapper}>
      <Box sx={formTitleWrapper}>
        <Typography>{title}</Typography>
      </Box>
      {children}
      <Box sx={footerStyle(isMediumDevice)}>
        <Typography sx={footerTextStyle}>{footerText}</Typography>
        <Link href={url} sx={linkStyle}>
          {linkText}
        </Link>
      </Box>
      {showAboutAndContact && (
        <Box sx={FooterLink}>
          <Link href="/about" sx={linkStyle}>
            About
          </Link>
          <Link href="/contact" sx={linkStyle}>
            Contact
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default AuthWrapper;
