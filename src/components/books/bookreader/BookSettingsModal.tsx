import React from 'react';
import { useRecoilState } from 'recoil';
import { Modal } from '@mantine/core';
import { showingSettingsModalState } from '../../../state/bookStates';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

const ReaderSettingsModal: React.FC<Props> = (props: Props) => {
  const [showingSettingsModal, setShowingSettingsModal] = useRecoilState(showingSettingsModalState);

  return (
    <Modal
      opened={showingSettingsModal}
      // centered
      size="md"
      title="Book Settings"
      onClose={() => setShowingSettingsModal(!showingSettingsModal)}
    >
      {/* TODO */}
      HELLO
    </Modal>
  );
};

export default ReaderSettingsModal;
