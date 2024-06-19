import { Box } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AuthWrapper from "../components/AuthWrapper";
import { BlueButton } from "../components/Button";
import { Logo } from "../components/Logo";
import { TextInput, PasswordInput } from "../components/TextField";
import { cssReset, wrapper, formContentWrapper } from "../styles/index.jsx";
import useToken from "../services/AuthProvider.js";
import { userLogin } from "../services/apis.jsx";

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, {
      message: "Kolom username tidak boleh kosong.",
    })
    .max(100, {
      message: "Kolom username tidak boleh lebih dari 100 karakter.",
    })
    .refine((value) => !/\s/.test(value), {
      message: "Format username belum sesuai.",
    }),
  password: z
    .string()
    .min(1, {
      message: "Kolom Kata Sandi tidak boleh kosong.",
    })
    .min(6, {
      message: "Kata sandi tidak boleh kurang dari 6 karakter.",
    })
    .max(50, {
      message: "Kolom kata sandi tidak boleh lebih dari 50 karakter.",
    })
    .refine((value) => /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(value), {
      message:
        "Kata sandi harus memiliki minimal 6 karakter kombinasi angka/huruf.",
    }),
});

const Login = () => {
  const navigate = useNavigate();
  const { setToken, setUserId } = useToken();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data, e) => {
    e.preventDefault();
    addPosts(data.username, data.password);
  };

  const addPosts = async (username, password) => {
    try {
      const response = await userLogin(username, password);
      toast.success("Login berhasil!");

      setUserId(response.data.data.id);
      setToken(response.data.data.token);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/daftar-resep");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Terjadi kesalahan server. Silahkan coba kembali.");
      }
      reset();
    }
  };

  return (
    <Box sx={wrapper}>
      <style>{cssReset}</style>
      <div>
        <Toaster />
      </div>
      <Logo />
      <AuthWrapper
        title="Login"
        linkText=" Daftar Disini"
        url="/signup"
        footerText="Belum punya Akun? "
        showAboutAndContact={true}>
        <form onSubmit={handleSubmit(onSubmit)} style={formContentWrapper}>
          <TextInput
            label="Username"
            fieldName="username"
            field={register}
            errors={errors}
          />
          <PasswordInput
            label="Kata Sandi"
            fieldName="password"
            field={register}
            errors={errors}
          />
          <BlueButton
            text="Login"
            customStyle={{ width: "100%" }}
            type="submit"
          />
        </form>
      </AuthWrapper>
    </Box>
  );
};

export default Login;
