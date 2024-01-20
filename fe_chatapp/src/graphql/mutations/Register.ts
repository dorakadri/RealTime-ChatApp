import {gql} from "@apollo/client" 

export const REGISTER_USER=gql`
mutation RegisterUser($email:String!,$password:String!,$confirmpassword:String!,$fullname:String!){
    register(registerInput:{fullname:$fullname,email:$email,password:$password,confirmpassword:$confirmpassword}){
        user {
            email
            id
            fullame
            email
        }
    }
}
`
