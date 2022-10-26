import { Store } from "react-notifications-component";
import { Head } from "../seo/Head";
import { Button, Input, Loader } from "../ui-kit";
import { useForm } from "react-hook-form";
import { InputPassword } from "../ui-kit/InputPassword";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onSubmit",
    defaultValues: { email: "", password: "" },
  });
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  if (user) {
    router.replace("/customers");
  }
  const onSubmit = async (formData) => {
    console.log(formData);
    const { user, error } = await supabaseClient.auth.signIn(formData);
    if (user) {
      router.push("/customers");
    }
    if (error) {
      console.log(error);
      Store.addNotification({
        title: "Error!",
        message: error.message,
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 2000,
          onScreen: true,
        },
      });
    }
  };
  console.log(user, error);
  if (isLoading) {
    return <Loader type="spinner" fullPage />;
  }
  if (user) {
    return "";
  }

  return (
    <>
      <Head pageName={"Login"} />
      <main className="d-flex align-items-center">
        <section className="container">
          <form className="flex-grow-1" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-center">Log In</h1>
            <Input
              inputProps={{
                ...register("email", {
                  required: "This field is required",
                }),
                type: "text",
              }}
              inputNodeActive={true}
              error={errors.email}
              label="Email"
            />
            <InputPassword
              inputProps={{
                ...register("password", {
                  required: "This field is required",
                }),
              }}
              inputNodeActive={true}
              error={errors.password}
              label="Password"
            />
            <Button
              disabled={isSubmitting}
              loading={isSubmitting}
              type="submit"
            >
              Log In
            </Button>
            <Button
              variant="link"
              type="button"
              label="Forget your password?"
            />
          </form>
        </section>
      </main>
    </>
  );
}
