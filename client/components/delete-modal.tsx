import * as React from "react";
import styled from "styled-components";
import Modal from "./modal";
import Button from "./button";
import Cancel from "./cancel";
import { fonts } from "../utils/defaultStyles";

const DeleteTray = styled.div`
  display: flex;
  justify-content: flex-end;
  font-family: ${fonts.sans};
`;

const DeleteBody = styled.div`
  margin-bottom: 16px;
  padding: 16px;
  max-width: 480px;
`;

const DeleteTrayDivider = styled.hr`
  box-sizing: inherit;
  border: 0;
  height: 1px;
`;

const Box = styled.div``;

const DeleteWarning = styled.p`
  font-size: 16px;
`;

const quotedTitle = (title: string) => `"${title}"`;

interface IDeleteModalProps {
  closeModal: () => void;
  title: string;
  onCancelDelete: () => void;
  onDelete: () => void;
}

const DeleteModal: React.SFC<IDeleteModalProps> = ({
  closeModal,
  title,
  onCancelDelete,
  onDelete
}) => (
  <Modal closeUIModal={closeModal}>
    <Box>
      <DeleteBody>
        <DeleteWarning>
          Are you sure you want to delete <strong>{quotedTitle(title)}</strong>?
        </DeleteWarning>
      </DeleteBody>
      <DeleteTrayDivider />
      <DeleteTray>
        <Cancel onClick={onCancelDelete}>Cancel</Cancel>
        <Button onClick={onDelete}>Delete</Button>
      </DeleteTray>
    </Box>
  </Modal>
);

export default DeleteModal;
