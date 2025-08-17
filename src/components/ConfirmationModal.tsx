import { useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning" | "info";
  icon?: string;
  details?: string;
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "danger",
  icon,
  details,
}: ConfirmationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // Handle keyboard navigation and focus management
  useEffect(() => {
    if (isOpen) {
      // Focus the cancel button by default for safety
      cancelButtonRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onCancel();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onCancel]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      ref={modalRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-message"
      aria-modal="true"
    >
      <ModalContent>
        <ModalHeader>
          <ModalTitle id="modal-title">{title}</ModalTitle>
        </ModalHeader>

        <ModalBody>
          {icon && <IconContainer>{icon}</IconContainer>}
          <MessageText id="modal-message">{message}</MessageText>
          {details && <DetailsText>{details}</DetailsText>}
        </ModalBody>

        <ModalFooter>
          <CancelButton ref={cancelButtonRef} onClick={onCancel}>
            {cancelText}
          </CancelButton>
          <ConfirmButton variant={variant} onClick={onConfirm}>
            {confirmText}
          </ConfirmButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease;
  padding: 16px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 400px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ${slideIn} 0.2s ease;
`;

const ModalHeader = styled.div`
  padding: 24px 24px 0 24px;
  text-align: center;
`;

const ModalTitle = styled.h2`
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

const ModalBody = styled.div`
  padding: 24px;
  text-align: center;
`;

const IconContainer = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
  line-height: 1;
`;

const MessageText = styled.p`
  color: #374151;
  font-size: 1.1rem;
  line-height: 1.5;
  margin: 0 0 12px 0;
`;

const DetailsText = styled.p`
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0;
`;

const ModalFooter = styled.div`
  padding: 0 24px 24px 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

const CancelButton = styled.button`
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;

  &:hover {
    background-color: #e5e7eb;
    border-color: #9ca3af;
  }

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;

interface ConfirmButtonProps {
  variant: "danger" | "warning" | "info";
}

const getConfirmButtonStyles = (variant: "danger" | "warning" | "info") => {
  switch (variant) {
    case "danger":
      return {
        background: "#dc2626",
        hoverBackground: "#b91c1c",
        focusColor: "#dc2626",
      };
    case "warning":
      return {
        background: "#d97706",
        hoverBackground: "#b45309",
        focusColor: "#d97706",
      };
    case "info":
      return {
        background: "#2563eb",
        hoverBackground: "#1d4ed8",
        focusColor: "#2563eb",
      };
  }
};

const ConfirmButton = styled.button<ConfirmButtonProps>`
  background-color: ${(props) =>
    getConfirmButtonStyles(props.variant).background};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;

  &:hover {
    background-color: ${(props) =>
      getConfirmButtonStyles(props.variant).hoverBackground};
  }

  &:focus {
    outline: 2px solid
      ${(props) => getConfirmButtonStyles(props.variant).focusColor};
    outline-offset: 2px;
  }
`;
