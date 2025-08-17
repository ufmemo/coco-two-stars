import { useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";

interface WinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayAgain?: () => void;
}

export function WinModal({ isOpen, onClose, onPlayAgain }: WinModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const playAgainButtonRef = useRef<HTMLButtonElement>(null);

  // Handle keyboard navigation and focus management
  useEffect(() => {
    if (isOpen) {
      // Focus the play again button for positive action
      playAgainButtonRef.current?.focus();

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
      aria-labelledby="win-modal-title"
      aria-describedby="win-modal-message"
      aria-modal="true"
    >
      <ModalContent>
        <ModalHeader>
          <ModalTitle id="win-modal-title">Congratulations! 🎉</ModalTitle>
        </ModalHeader>

        <ModalBody>
          <IconContainer>🏆</IconContainer>
          <MessageText id="win-modal-message">
            You successfully completed the puzzle!
          </MessageText>
          <DetailsText>Great job solving all the constraints!</DetailsText>
        </ModalBody>

        <ModalFooter>
          <CloseButton onClick={onClose}>Close</CloseButton>
          {onPlayAgain && (
            <PlayAgainButton ref={playAgainButtonRef} onClick={onPlayAgain}>
              Play Again
            </PlayAgainButton>
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

const celebration = keyframes`
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.05);
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
  background: linear-gradient(135deg, #d4edda 0%, #f0f9ff 100%);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 3px solid #2d5a27;
  max-width: 400px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ${slideIn} 0.3s ease, ${celebration} 0.6s ease 0.3s;
`;

const ModalHeader = styled.div`
  padding: 24px 24px 0 24px;
  text-align: center;
`;

const ModalTitle = styled.h2`
  color: #2d5a27;
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
  animation: ${celebration} 1s ease infinite;
`;

const MessageText = styled.p`
  color: #2d5a27;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.5;
  margin: 0 0 12px 0;
`;

const DetailsText = styled.p`
  color: #4a7c59;
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

const PlayAgainButton = styled.button`
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);

  &:hover {
    background: linear-gradient(135deg, #218838 0%, #17a2b8 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
  }

  &:focus {
    outline: 2px solid #28a745;
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(0);
  }
`;
