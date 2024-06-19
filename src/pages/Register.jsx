import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AuthWrapper from "../components/AuthWrapper";
import { BlueButton } from "../components/Button.jsx";
import { Logo } from "../components/Logo";
import { TextInput, PasswordInput } from "../components/TextField";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import toast from "react-hot-toast";
import { cssReset, wrapper, formContentWrapper } from "../styles/index.jsx";
import { userRegister } from "../services/apis.jsx";

export const registerSchema = z
  .object({
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
    fullname: z
      .string()
      .min(1, {
        message: "Kolom nama lengkap tidak boleh kosong.",
      })
      .refine((value) => /^[a-zA-Z0-9\s]{0,255}$/.test(value), {
        message:
          "Format nama lengkap belum sesuai. (Tidak menggunakan special character dan maksimal 255 charackter).",
      }),
    password: z
      .string()
      .min(1, { message: "Kolom kata sandi tidak boleh kosong." })
      .min(6, {
        message: "Kata sandi tidak boleh kurang dari 6 karakter.",
      })
      .max(50, {
        message: "Kolom kata sandi tidak boleh lebih dari 50 karakter.",
      })
      .refine((value) => /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(value), {
        message:
          "Kata sandi harus memiliki minimal 6 karakter kombinasi angka dan huruf.",
      }),
    retypePassword: z.string().min(1, {
      message: "Kolom Konfirmasi Kata Sandi tidak boleh kosong",
    }),
  })
  .refine((data) => data.password === data.retypePassword, {
    message: "Konfirmasi kata sandi tidak sama dengan kata sandi.",
    path: ["retypePassword"],
  });

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await userRegister(data);
      if (response.data.status === "OK") {
        toast.success(response.data.message);
        navigate("/user-management/users/signin");
        toast.success("Berhasil daftar!");
        navigate("/");
      }

      if (response.data.status === "ERROR") {
        toast.error(response.data.message);
      }
    } catch (error) {
        toast.error("Terjadi kesalahan server. Silahkan coba kembali.");
      reset();
    }
  };

  return (
    <Box sx={wrapper}>
      <style>{cssReset}</style>
      <Logo />
      <AuthWrapper
        title="Daftar"
        linkText="Batal, Kembali ke Halaman Login"
        url="/">
        <form onSubmit={handleSubmit(onSubmit)} style={formContentWrapper}>
          <TextInput
            label="Username"
            fieldName="username"
            field={register}
            errors={errors}
          />
          <TextInput
            label="Nama Lengkap"
            fieldName="fullname"
            field={register}
            errors={errors}
          />
          <PasswordInput
            label="Kata Sandi"
            fieldName="password"
            field={register}
            errors={errors}
          />
          <PasswordInput
            label="Konfirmasi Kata Sandi"
            fieldName="retypePassword"
            field={register}
            errors={errors}
          />
          <BlueButton
            text="Daftar"
            customStyle={{ width: "100%" }}
            type="submit"
          />
        </form>
      </AuthWrapper>
    </Box>
  );
};

export default Register;
