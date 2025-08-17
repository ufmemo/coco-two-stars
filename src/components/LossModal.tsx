import { useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";

interface LossModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTryAgain?: () => void;
}

export function LossModal({ isOpen, onClose, onTryAgain }: LossModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const tryAgainButtonRef = useRef<HTMLButtonElement>(null);

  // Handle keyboard navigation and focus management
  useEffect(() => {
    if (isOpen) {
      // Focus the try again button for positive action
      tryAgainButtonRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

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
      onClose();
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
      aria-labelledby="loss-modal-title"
      aria-describedby="loss-modal-message"
      aria-modal="true"
    >
      <ModalContent>
        <ModalHeader>
          <ModalTitle id="loss-modal-title">Game Over</ModalTitle>
        </ModalHeader>

        <ModalBody>
          <IconContainer>❌</IconContainer>
          <MessageText id="loss-modal-message">
            No more valid moves available!
          </MessageText>
          <DetailsText>
            Don't worry - every puzzle is a learning experience!
          </DetailsText>
        </ModalBody>

        <ModalFooter>
          <CloseButton onClick={onClose}>Close</CloseButton>
          {onTryAgain && (
            <TryAgainButton ref={tryAgainButtonRef} onClick={onTryAgain}>
              Try Again
            </TryAgainButton>
          )}
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

const shake = keyframes`
  0%, 100% {
    transform: translate(-50%, -50%) translateX(0);
  }
  25% {
    transform: translate(-50%, -50%) translateX(-5px);
  }
  75% {
    transform: translate(-50%, -50%) translateX(5px);
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
  animation: ${fadeIn} 0.3s ease;
  padding: 16px;
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #f8d7da 0%, #fff3cd 100%);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 3px solid #721c24;
  max-width: 400px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ${slideIn} 0.3s ease, ${shake} 0.5s ease 0.3s;
`;

const ModalHeader = styled.div`
  padding: 24px 24px 0 24px;
  text-align: center;
`;

const ModalTitle = styled.h2`
  color: #721c24;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ModalBody = styled.div`
  padding: 24px;
  text-align: center;
`;

const IconContainer = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
  line-height: 1;
`;

const MessageText = styled.p`
  color: #721c24;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.5;
  margin: 0 0 12px 0;
`;

const DetailsText = styled.p`
  color: #856404;
  font-size: 1rem;
  margin: 0;
`;

const ModalFooter = styled.div`
  padding: 0 24px 24px 24px;
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`;

const CloseButton = styled.button`
  background-color: #f3f4f6;
  color: #374151;
  border: 2px solid #d1d5db;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;

  &:hover {
    background-color: #e5e7eb;
    border-color: #9ca3af;
    transform: translateY(-1px);
  }

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;

const TryAgainButton = styled.button`
  background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);

  &:hover {
    background: linear-gradient(135deg, #c82333 0%, #e0a800 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
  }

  &:focus {
    outline: 2px solid #dc3545;
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(0);
  }
`;
