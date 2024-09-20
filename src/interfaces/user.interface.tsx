// Define the base User interface
export interface User {
          _id: string;
          firstName: string;
          lastName: string;
          email: string;
          organization: string;
}

// Create a new type by omitting the _id property from User
export interface UserLogin extends Omit<User, '_id'> {
          password: string;
          confirmPassword: string;
}
