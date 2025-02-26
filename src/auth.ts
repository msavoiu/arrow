import { AuthOptions, getServerSession } from "next-auth";

const authOptions: AuthOptions = {
  providers: []
};

const getSession = () => getServerSession(authOptions);

export { authOptions, getSession };
