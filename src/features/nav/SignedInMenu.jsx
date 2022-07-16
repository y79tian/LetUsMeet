import React from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Menu, Image, Dropdown } from "semantic-ui-react";
import { signOutFirebase } from "../../app/firestore/firebaseService";
import { toast } from "react-toastify";

export default function SignedInMenu() {
  async function handleSignOut() {
    try {
      history.push("/");
      await signOutFirebase();
    } catch (error) {
      toast.error(error.message);
    }
  }
  const { currentUserProfile } = useSelector((state) => state.profile);
  const history = useHistory();
  return (
    <Menu.Item position="right">
      <Image
        avatar
        spaced="right"
        src={currentUserProfile.photoURL || "/assets/user.png"}
      />
      <Dropdown pointing="top left" text={currentUserProfile.displayName}>
        <Dropdown.Menu>
          <Dropdown.Item
            as={Link}
            to="/createEvent"
            text="Create Event"
            icon="plus"
          />
          <Dropdown.Item
            text="My Profile"
            icon="user"
            as={Link}
            to={`/profile/${currentUserProfile?.id}`}
          />
          <Dropdown.Item
            as={Link}
            to="/account"
            text="My Account"
            icon="setting"
          />
          <Dropdown.Item text="Sign out" icon="power" onClick={handleSignOut} />
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
  );
}
