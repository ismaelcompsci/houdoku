import React from 'react';
import { useRecoilState } from 'recoil';

import { Modal } from '@mantine/core';
import { showingSettingsModalState } from '../../../state/bookStates';
import BookSettings from '../../settings/BookSettings';

const ReaderSettingsModal = () => {
  const [showingSettingsModal, setShowingSettingsModal] = useRecoilState(showingSettingsModalState);

  return (
    <Modal
      opened={showingSettingsModal}
      // centered
      size="md"
      title="Book Settings"
      onClose={() => setShowingSettingsModal(!showingSettingsModal)}
    >
      <BookSettings />
    </Modal>
  );
};

export default ReaderSettingsModal;
