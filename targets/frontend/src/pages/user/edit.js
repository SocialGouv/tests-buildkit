import { useRouter } from "next/router";
import { Layout } from "src/components/layout/auth.layout";
import { UserForm } from "src/components/user/UserForm";
import { withCustomUrqlClient } from "src/hoc/CustomUrqlClient";
import { withUserProvider } from "src/hoc/UserProvider";
import { useUser } from "src/hooks/useUser";
import { useMutation } from "urql";

const saveUserMutation = `
mutation saveUser($id: uuid!, $name:String!, $email: citext!) {
  update_auth_users(_set: {
    name: $name,
    email: $email,
    },
    where: {
    id: {_eq: $id}
    }
  ){
    returning {
      __typename
    }
  }
}
`;

const saveRoleMutation = `
mutation saveRole($id: uuid!, $role:String!) {
  update_auth_user_roles(_set: {role: $role}, where: {
    users: {
      id: {_eq: $id}
    }
  }) {
    returning {
      __typename
    }
  }
}
`;

export function EditUserPage() {
  const { user, isAdmin } = useUser();
  const router = useRouter();
  const [userResult, saveUser] = useMutation(saveUserMutation);
  const [roleResult, saveRole] = useMutation(saveRoleMutation);
  function handleSubmit(data) {
    const { name, email, role } = data;
    let rolePromise = Promise.resolve();
    if (user.roles.every((item) => item.role !== role)) {
      rolePromise = saveRole({ id: user.id, role });
    }
    rolePromise
      .then(() => saveUser({ email, id: user.id, name }))
      .then((result) => {
        if (!result.error) {
          router.push("/users");
        }
      });
  }
  return (
    <Layout title="Modifier mes informations">
      {user && (
        <UserForm
          user={user}
          loading={userResult.fetching || roleResult.fetching}
          onSubmit={handleSubmit}
          isAdmin={isAdmin}
          backHref="/user/account"
        />
      )}
    </Layout>
  );
}

export default withCustomUrqlClient(withUserProvider(EditUserPage));
