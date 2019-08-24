import React, { useContext } from "react";
import AntModal, { ModalProps } from "antd/lib/modal";
import { CondominiumContext } from "../../pages/shell";
import { BladeContext } from "../../organisisms/blade-manager";
import "antd/lib/modal/style/css";

const Modal: React.FC<ModalProps> = ({
  title,
  okButtonProps = {},
  ...props
}) => {
  const { condominium } = useContext(CondominiumContext);
  const { loading } = useContext(BladeContext);
  const NewTitle =
    condominium && condominium.id ? (
      <span>
        {condominium.name}
        <br />
        {title}
      </span>
    ) : (
      title
    );

  const newOkButtonProps = {
    ...okButtonProps,
    loading,
    disabled: okButtonProps.disabled || loading
  };

  return (
    <AntModal
      {...props}
      title={NewTitle}
      okButtonProps={newOkButtonProps}
      okButtonDisabled={loading}
    />
  );
};

export const { confirm } = AntModal;

export default Modal;
