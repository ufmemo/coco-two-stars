import { useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle keyboard navigation and focus management
  useEffect(() => {
    if (isOpen) {
      // Focus the close button
      closeButtonRef.current?.focus();

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
      aria-labelledby="instructions-title"
      aria-describedby="instructions-content"
      aria-modal="true"
    >
      <ModalContent>
        <ModalHeader>
          <ModalTitle id="instructions-title">How to Play Two Stars</ModalTitle>
          <CloseButton
            onClick={onClose}
            aria-label="Close instructions"
            title="Close instructions"
          >
            ✕
          </CloseButton>
        </ModalHeader>

        <ModalBody id="instructions-content">
          <Section>
            <SectionTitle>🎯 Objective</SectionTitle>
            <SectionText>
              Remove all tiles from the board by clicking on groups of 2 or more
              connected tiles of the same color. Your goal is to clear the
              entire board.
            </SectionText>
          </Section>

          <Section>
            <SectionTitle>🎮 How to Play</SectionTitle>
            <StepList>
              <Step>
                <StepNumber>1.</StepNumber>
                <StepText>
                  Click on any tile that has at least one adjacent tile of the
                  same color
                </StepText>
              </Step>
              <Step>
                <StepNumber>2.</StepNumber>
                <StepText>
                  All connected tiles of the same color will be removed
                </StepText>
              </Step>
              <Step>
                <StepNumber>3.</StepNumber>
                <StepText>
                  Remaining tiles will fall down due to gravity
                </StepText>
              </Step>
              <Step>
                <StepNumber>4.</StepNumber>
                <StepText>
                  Repeat until the board is clear or no more moves are possible
                </StepText>
              </Step>
            </StepList>
          </Section>

          <Section>
            <SectionTitle>⭐ Winning</SectionTitle>
            <SectionText>
              Win by clearing all tiles from the board. If you get stuck with
              isolated tiles (no adjacent tiles of the same color), you'll need
              to start over with a new game.
            </SectionText>
          </Section>

          <Section>
            <SectionTitle>💡 Strategy Tips</SectionTitle>
            <TipList>
              <Tip>Plan ahead - removing tiles affects the entire column</Tip>
              <Tip>
                Look for large groups first to create more opportunities
              </Tip>
              <Tip>Be careful not to isolate tiles at the bottom</Tip>
              <Tip>Sometimes it's better to leave smaller groups for later</Tip>
            </TipList>
          </Section>
        </ModalBody>

        <ModalFooter>
          <CloseModalButton ref={closeButtonRef} onClick={onClose}>
            Got it!
          </CloseModalButton>
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
  max-width: 500px;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h2`
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  line-height: 1;

  &:hover {
    color: #374151;
    background-color: #f3f4f6;
  }

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const Section = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SectionText = styled.p`
  color: #374151;
  line-height: 1.6;
  margin: 0;
  text-align: left;
`;

const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
`;

const Step = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const StepNumber = styled.span`
  background-color: #2d5a27;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 600;
  flex-shrink: 0;
`;

const StepText = styled.span`
  color: #374151;
  line-height: 1.5;
  padding-top: 2px;
  text-align: left;
`;

const TipList = styled.ul`
  margin: 0;
  padding-left: 20px;
  color: #374151;
  line-height: 1.6;
`;

const Tip = styled.li`
  margin-bottom: 8px;
  text-align: left;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ModalFooter = styled.div`
  padding: 0 24px 24px 24px;
  display: flex;
  justify-content: center;
`;

const CloseModalButton = styled.button`
  background-color: #2d5a27;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;

  &:hover {
    background-color: #1e3d1a;
  }

  &:focus {
    outline: 2px solid #2d5a27;
    outline-offset: 2px;
  }
`;
