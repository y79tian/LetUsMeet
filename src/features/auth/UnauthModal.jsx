import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Button, Divider, Modal } from "semantic-ui-react";
import { openModal } from "../../app/common/modals/modalReducer";

export default function UnauthModal({ history, setModalOpen }) {
  const [open, setOpen] = useState(true);
  const { prevLocation } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  function handleOpenLoginModal(modalType) {
    dispatch(openModal({ modalType }));
    setOpen(false);
    if (setModalOpen) setModalOpen(false);
  }

  function handleClose() {
    if (!history) {
      setModalOpen(false);
      setOpen(false);
      return;
    }
    if (history && prevLocation) {
      history.push(prevLocation.pathname);
    } else {
      history.push("/events");
    }
    setOpen(false);
  }
  return (
    <Modal open={open} size="mini" onClose={handleClose}>
      <Modal.Header content="You need to sign in to do that" />
      <Modal.Content>
        <p>Please either login or register to see the content</p>
        <Button.Group width={4}>
          <Button
            fluid
            color="teal"
            content="Login"
            onClick={() => handleOpenLoginModal("LoginForm")}
          />
          <Button.Or />
          <Button
            fluid
            color="green"
            content="Register"
            onClick={() => handleOpenLoginModal("RegisterForm")}
          />
        </Button.Group>
        <Divider />
        <div style={{ textAlign: "center" }}>
          <p>Or click cancel to continue as guest</p>
          <Button onClick={handleClose} content="Cancel" />
        </div>
      </Modal.Content>
    </Modal>
  );
}
