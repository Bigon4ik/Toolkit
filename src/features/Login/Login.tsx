import React from "react";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FormikHelpers, useFormik } from "formik";
import { AppRootStateType } from "app/store";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authThunks } from "features/Login/auth-reducer";
import { BaseResponseType } from "common/api/todolists-api";

export type LoginDataType = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export const Login = () => {
  const dispatch = useDispatch<any>();
  const isLoggedIn = useSelector<AppRootStateType>((state) => state.auth.isLoggedIn);

  type FormikErrorType = {
    email?: string;
    password?: string;
    rememberMe?: boolean;
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false
    },
    validate: (values) => {
      const errors: FormikErrorType = {};
      // if (!values.email) {
      //   errors.email = "Required";
      // } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      //   errors.email = "Invalid email address";
      // }
      // if (!values.email) {
      //   errors.password = "Required";
      // } else if (values.password.length < 5) {
      //   errors.password = "Password length have to more 5 symbols";
      // }
      // return errors;
    },
    onSubmit: async (values, formikHelpers:FormikHelpers<any>) => {
      dispatch(authThunks.login(values))
        .unwrap()
        .catch((err:BaseResponseType) => {
          err.fieldsErrors?.forEach((fieldError)=>{
            formikHelpers.setFieldError(fieldError.field, fieldError.error)
          })
        })

      formik.resetForm();
    }
  });

  if (isLoggedIn) {
    return <Navigate to={"/"} />;
  }
  return (
    <Grid container justifyContent={"center"}>
      <Grid item justifyContent={"center"}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered
                <a href={"https://social-network.samuraijs.com/"} target={"_blank"}>
                  {" "}
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p>Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField label="Email" margin="normal"
                // error={!!(formik.touched.email && formik.errors.email)}
                // helperText={formik.touched.email && formik.errors.email}
                {...formik.getFieldProps("email")}
              />
              {formik.errors.email ? <div style={{color:"red"}}> {formik.errors.email}</div>:null}
              <TextField
                type="password" label="Password" margin="normal"
                // error={!!(formik.touched.password && formik.errors.password)}
                // helperText={formik.touched.password && formik.errors.password}
                {...formik.getFieldProps("password")}
              />
              {formik.errors.password ? <div style={{color:"red"}}> {formik.errors.password}</div>:null}

              <FormControlLabel
                label={"Remember me"}
                control={<Checkbox checked={formik.values.rememberMe} {...formik.getFieldProps("rememberMe")} />}
              />
              <Button disabled={formik.isSubmitting} type={"submit"} variant={"contained"} color={"primary"}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  );
};
