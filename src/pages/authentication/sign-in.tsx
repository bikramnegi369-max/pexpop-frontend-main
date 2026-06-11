/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import { useState, type FC } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { api } from "../../services/api";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";
import Loading from "../../components/loading";
interface LoginInputs {
  email: string;
  password: string;
}
const SignInPage: FC = function () {
  const [isLoading, setLoading] = useState<boolean>(false);
  const ctx = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();
  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    setLoading(true);
    const res = await api.post("/auth/login", JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });

    if (res.data.status === "success") {
      setLoading(false);
      ctx?.login(res.data.token);
      toast.success(res.data.message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      setLoading(false);
      toast.error(res.data.message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 lg:h-screen lg:gap-y-12">
      {/* <div className="my-6 flex items-center gap-x-1 lg:my-0">
        <img
          alt="Flowbite logo"
          src="https://flowbite.com/docs/images/logo.svg"
          className="mr-3 h-12"
        />
        <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
          Flowbite
        </span>
      </div> */}
      <Card
        horizontal
        imgSrc="/images/authentication/login.jpg"
        imgAlt=""
        className="w-full md:max-w-screen-sm [&>img]:hidden md:[&>img]:w-96 md:[&>img]:p-0 md:[&>*]:w-full md:[&>*]:p-16 "
      >
        <h1 className="mb-3 text-2xl font-bold dark:text-white md:text-3xl">
          Sign in
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 flex flex-col gap-y-3">
            <Label htmlFor="email">Your email</Label>
            <TextInput
              id="email"
              {...register("email", { required: true, maxLength: 40 })}
              placeholder="name@company.com"
              type="email"
            />
          </div>
          {errors.email && (
            <span className="text-red-500">This field is required</span>
          )}
          <div className="mb-6 flex flex-col gap-y-3">
            <Label htmlFor="password">Your password</Label>
            <TextInput
              id="password"
              {...register("password", { required: true, maxLength: 20 })}
              placeholder="••••••••"
              type="password"
            />
          </div>
          {errors.email && (
            <span className="text-red-500">This field is required</span>
          )}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-x-3">
              <Checkbox id="rememberMe" name="rememberMe" />
              <Label htmlFor="rememberMe">Remember me</Label>
            </div>
            <a
              href="#"
              className="w-1/2 text-right text-sm text-primary-600 dark:text-primary-300"
            >
              Lost Password?
            </a>
          </div>
          <div className="mb-6">
            <Button
              type="submit"
              className="w-full lg:w-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex gap-3">
                  Logging in
                  <Loading />{" "}
                </span>
              ) : (
                <span>Login to your account </span>
              )}
            </Button>
          </div>
          {/* <p className="text-sm text-gray-500 dark:text-gray-300">
            Not registered?&nbsp;
            <a href="#" className="text-primary-600 dark:text-primary-300">
              Create account
            </a>
          </p> */}
        </form>
      </Card>
    </div>
  );
};

export default SignInPage;
