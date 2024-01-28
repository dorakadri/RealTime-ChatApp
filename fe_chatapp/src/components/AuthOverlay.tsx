import React, { useState } from "react";
import { useGeneralStore } from "../stores/generalstore";
import { Anchor, Button, Container, Modal, Paper, PasswordInput, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useUserStore } from "../stores/userStore";
import { GraphQLErrorExtensions } from "graphql";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "../graphql/mutations/Register";
import { LoginUserMutation,RegisterUserMutation } from "../gql/graphql";
import classes from '../Mantinecss/FormRegister.module.css';
import { LOGIN_USER } from "../graphql/mutations/Login";
interface RegisterProps {
  setIsRegister: React.Dispatch<React.SetStateAction<boolean>>;

}
function AuthOverlay() {
  const [isRegister,setIsRegister]=useState(true);
  const isLoginModalOpen = useGeneralStore((state) => state.isLoginModalOpen);
  const toggleLoginModal = useGeneralStore((state) => state.toggleLoginModal);

  return (
    <Modal
      centered
      opened={isLoginModalOpen}
      onClose={toggleLoginModal}
    >
     {isRegister ?   <Register setIsRegister={setIsRegister}  /> : <Login setIsRegister={setIsRegister} />}
      
    </Modal>
  );
}

const Register: React.FC<RegisterProps>= ({ setIsRegister }) => {
  const setUser = useUserStore((state) => state.setUser);
  const setLoginOpen = useGeneralStore((state) => state.toggleLoginModal);
  const [errors, setErrors] = useState<GraphQLErrorExtensions>({});

  const [registerUser, { loading }] =
    useMutation<RegisterUserMutation>(REGISTER_USER);

  const handleRegister = async () => {
    setErrors({});

    await registerUser({
      variables: {
        email: form.values.email,
        password: form.values.password,
        fullname: form.values.fullname,
        confirmPassword: form.values.confirmPassword,
      },
      onCompleted: (data) => {
        setErrors({});
     
        if (data?.register.user)
          setUser({
            id: data?.register.user.id,
            email: data?.register.user.email,
            fullname: data?.register.user.fullname,
          });
        setLoginOpen();
      },
    }).catch((err) => {
      console.log(err.graphQLErrors)
      setErrors(err.graphQLErrors[0].extensions);
      useGeneralStore.setState({ isLoginModalOpen: true });
    });
  };
  const form = useForm({
    initialValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      fullname: (value: string) =>
        value.trim().length >= 3
          ? null
          : "username must be a least 3 charaters",
      email: (value: string) => (value.includes("@") ? null : "invalid email"),
      password: (value: string) =>
        value.trim().length >= 3
          ? null
          : "Password must be at least 3 characters",
      confirmPassword: (value: string, values) =>
      value === values.password
          ? null
          : "PAswword do not match",
    },
  });

 const toggleForm =()=>{
  setIsRegister((prev)=>!prev)
 }
  return (
    <Container size={420} my={40}>
    <Title ta="center" className={classes.title}>
      Register 
    </Title>

    <Paper  p={30} mt={30} radius="md">
      <form onSubmit={form.onSubmit(()=>{
        handleRegister();
      })}>
      <TextInput autoComplete="off" label="Username" placeholder="Onyx"    {...form.getInputProps("fullname")} error={form.errors.fullname || ( (errors?.fullname) as string)}  />
      <TextInput autoComplete="off" label="Email" placeholder="you@gmail.dev"    {...form.getInputProps("email")} error={form.errors.email || ((errors?.email) as string)}  />
      <TextInput  autoComplete="off"label="Password" placeholder="Your password"  mt="md" {...form.getInputProps("password")} error={form.errors.password || ((errors?.password) as string)} />
      <TextInput autoComplete="off"  label="ConfirmPassword" placeholder="ConfirmPassword" {...form.getInputProps("confirmPassword")}  mt="md" error={form.errors.confirmPassword || ((errors?.confirmPassword) as string)} />
      <Button type="submit" fullWidth mt="xl"  disabled={loading}>
        Register
      </Button>
      
      <Text ta="center" mt="md">
          already have an account?{' '}
          <Anchor<'a'> href="#" fw={700} onClick={toggleForm}>
            Login
          </Anchor>
        </Text>
      </form>
    </Paper>
  </Container>
  );
};


const Login: React.FC<RegisterProps>= ({ setIsRegister }) => {
  const [loginUser, { loading }] =
  useMutation<LoginUserMutation>(LOGIN_USER);

  const setUser =useUserStore((state)=>state.setUser)
  const setIsLoginOpen=useGeneralStore((state)=>state.toggleLoginModal) 
  const [errors, setErrors] = useState<GraphQLErrorExtensions>({});
  const [invalidCredentials,setInvalidCredentials] = useState("");
  const form=useForm({
    initialValues:{
      email:"",
      password:"",
    },
    validate:{
      email:(value:string)=>value.includes("@") ? null :"invalid email",
      password:(value :string)=>value.length>=3 ? null :"invalid password"
    }
  })
  const handleLogin=async()=>{
    setErrors({});
    await loginUser({
      variables:{
        email:form.values.email,
        password:form.values.password
      },
      onCompleted:(data)=>{
        setErrors({})
          if(data?.login.user){
            setUser({
              id:data?.login.user.id,
              email:data?.login.user.email,
              fullname:data?.login.user.fullname,
              avatarUrl:data?.login.user.avatarUrl,
            })
            setIsLoginOpen();
          }
      }
    }).catch((err) => {
      setErrors(err.graphQLError[0].extensions);
      if(err.graphQLError[0].extensions?.invalidCredentials)
      setInvalidCredentials(err.graphQLErrors[0].extensions?.invalidCredentials)
      useGeneralStore.setState({ isLoginModalOpen: true });
    });
  }

  const toggleForm =()=>{
    setIsRegister((prev)=>!prev)
   }
  return (
    <Container size={420} my={40}>
    <Title ta="center" className={classes.title}>
      Login 
    </Title>

    <Paper  p={30} mt={30} radius="md">
      <form onSubmit={form.onSubmit(()=>{
        handleLogin();
      })}>
      
      <TextInput label="Email" placeholder="you@gmail.dev"    {...form.getInputProps("email")} error={form.errors.email || ((errors?.email) as string)}  />
      <PasswordInput label="Password" placeholder="Your password"  mt="md" {...form.getInputProps("password")} error={form.errors.password || ((errors?.password) as string)} />
    
      <Button type="submit" fullWidth mt="xl"  disabled={loading}>
        login
      </Button>
      
      <Text ta="center" mt="md">
          dont have an account yet  ? {' '}
          <Anchor<'a'> href="#" fw={700} onClick={toggleForm}>
            Register
          </Anchor>
        </Text>
      </form>
    </Paper>
  </Container>
  )
}

export default AuthOverlay;
