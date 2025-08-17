import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { clearAllGameStates } from "../utils/localStorage";

interface ResetAllButtonProps {
  onReset?: () => void;
}

export function ResetAllButton({ onReset }: ResetAllButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleResetClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmReset = async () => {
    setIsResetting(true);
    setShowConfirmation(false);

    try {
      // Clear all game states
      clearAllGameStates();

      // Show success feedback
      setShowSuccess(true);

      // Call the onReset callback to refresh UI
      onReset?.();

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to reset all games:", error);
    } finally {
      setIsResetting(false);
    }
  };

  const handleCancelReset = () => {
    setShowConfirmation(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowConfirmation(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowConfirmation(false);
    }
  };

  return (
    <>
      <ResetButton
        onClick={handleResetClick}
        disabled={isResetting}
        title="Reset all game progress"
      >
        {isResetting ? "Resetting..." : "Reset All Progress"}
      </ResetButton>

      {showSuccess && (
        <SuccessMessage>
          ✓ All game progress has been reset successfully!
        </SuccessMessage>
      )}

      {showConfirmation && (
        <Modal
          onClick={handleBackdropClick}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Reset All Progress</ModalTitle>
            </ModalHeader>

            <ModalBody>
              <WarningIcon>⚠️</WarningIcon>
              <WarningText>
                This will permanently delete all your game progress across all
                boards. This action cannot be undone.
              </WarningText>
              <DetailText>
                Are you sure you want to reset all {13} boards?
              </DetailText>
            </ModalBody>

            <ModalFooter>
              <CancelButton onClick={handleCancelReset} autoFocus>
                Cancel
              </CancelButton>
              <ConfirmButton onClick={handleConfirmReset}>
                Yes, Reset All
              </ConfirmButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}

const ResetButton = styled.button`
  background-color: #dc2626;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);
  margin: 20px 0;

  &:hover:not(:disabled) {
    background-color: #b91c1c;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &:focus {
    outline: 2px solid #dc2626;
    outline-offset: 2px;
  }
`;

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
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 400px;
  width: 90%;
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

const WarningIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
`;

const WarningText = styled.p`
  color: #374151;
  font-size: 1.1rem;
  line-height: 1.5;
  margin: 0 0 12px 0;
`;

const DetailText = styled.p`
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0;
`;

const ModalFooter = styled.div`
  padding: 0 24px 24px 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
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

  &:hover {
    background-color: #e5e7eb;
    border-color: #9ca3af;
  }

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;

const ConfirmButton = styled.button`
  background-color: #dc2626;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #b91c1c;
  }

  &:focus {
    outline: 2px solid #dc2626;
    outline-offset: 2px;
  }
`;

const successSlideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SuccessMessage = styled.div`
  background-color: #10b981;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  text-align: center;
  margin: 16px 0;
  animation: ${successSlideIn} 0.3s ease;
  box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);
`;
