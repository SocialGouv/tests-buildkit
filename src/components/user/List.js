/** @jsx jsx */
import { useQuery, useMutation } from "urql";
import { css, jsx, Badge, Text } from "theme-ui";
import { IoIosCheckmark, IoMdCloseCircle } from "react-icons/io";
import PropTypes from "prop-types";
import { MenuButton, MenuItem, Button } from "../button";
import { useRouter } from "next/router";
import { useState } from "react";
import { Dialog } from "../dialog";
import { Inline } from "../layout/Inline";

const query = `
query getUsers {
  users: auth_users {
    __typename
    id
    email
    name
    active
    created_at
    default_role
    roles: user_roles {
      role
    }
  }
}
`;

const deleteUserMutation = `
mutation deleteUser($id: uuid!) {
  delete_auth_users_by_pk(id: $id) {
 		__typename
  }
}
`;

export function UserList() {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

  const [result] = useQuery({
    query,
  });
  const { data, fetching, error } = result;
  const [, executeDelete] = useMutation(deleteUserMutation);

  function confirmDeleteUser(id, email) {
    setSelectedUser({ id, email });
    open();
  }

  function onDeleteUser() {
    executeDelete({ id: selectedUser.id });
    close();
  }

  if (fetching) return <p>chargement...</p>;
  if (error)
    return (
      <div className="alert alert-warning">
        <pre>{JSON.stringify(error, 0, 2)}</pre>
      </div>
    );

  return (
    <>
      <Dialog isOpen={showDialog} onDismiss={close}>
        <Text>Etes vous sur de vouloir supprimer l’utilisateur</Text>
        <strong>{selectedUser?.email}</strong>
        <Inline>
          <Button onClick={onDeleteUser}>Supprimer l’utilisateur</Button>
          <Button variant="link" onClick={close}>
            Annuler
          </Button>
        </Inline>
      </Dialog>
      <table css={styles.table}>
        <thead>
          <tr>
            <Th align="center">Rôle</Th>
            <Th>Nom d’utilisateur</Th>
            <Th>Email</Th>
            <Th>Date de création</Th>
            <Th align="center">Activé</Th>
            <Th align="center">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {data.users.map(
            ({ id, roles: [{ role }], name, email, created_at, active }) => (
              <Tr key={id}>
                <Td align="center">
                  <Badge variant={role === "admin" ? "primary" : "secondary"}>
                    {role}
                  </Badge>
                </Td>
                <Td>{name}</Td>
                <Td>{email}</Td>
                <Td>{new Date(created_at).toLocaleDateString("fr-FR")}</Td>
                <Td align="center">
                  {active ? <IoIosCheckmark /> : <IoMdCloseCircle />}
                </Td>
                <Td align="center">
                  <MenuButton variant="secondary">
                    <MenuItem
                      onSelect={() =>
                        router.push("/user/edit/[id]", `/user/edit/${id}`)
                      }
                    >
                      Modifier
                    </MenuItem>
                    <MenuItem onSelect={() => confirmDeleteUser(id, email)}>
                      Supprimer
                    </MenuItem>
                  </MenuButton>
                </Td>
              </Tr>
            )
          )}
        </tbody>
      </table>
    </>
  );
}
const Tr = (props) => <tr css={styles.tr} {...props} />;

const cellPropTypes = {
  align: PropTypes.oneOf(["left", "right", "center"]),
};
const Th = ({ align = "left", ...props }) => (
  <th css={styles.th} sx={{ textAlign: align }} {...props} />
);
Th.propTypes = cellPropTypes;
const Td = ({ align = "left", ...props }) => (
  <td css={styles.td} {...props} sx={{ textAlign: align }} />
);
Td.propTypes = cellPropTypes;

const styles = {
  table: css({
    borderCollapse: "collapse",
    borderRadius: "small",
    overflow: "hidden",
    width: "100%",
  }),
  th: css({
    px: "xsmall",
    py: "xsmall",
    borderBottom: "1px solid",
    // bg: "info",
    // color: "white",
    fontWeight: "semibold",
    fontSize: "medium",
  }),
  td: css({
    px: "xsmall",
    py: "xxsmall",
    fontWeight: 300,
    "tr:nth-of-type(even) &": {
      bg: "highlight",
    },
  }),
};
