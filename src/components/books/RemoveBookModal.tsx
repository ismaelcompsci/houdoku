import { Book } from 'houdoku-extension-lib';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import { Button, Checkbox, Group, Modal, Text } from '@mantine/core';

import routes from '../../constants/routes.json';
import { removeBook } from '../../features/library/utils';
import { bookListState } from '../../state/libraryStates';
import { confirmRemoveSeriesState } from '../../state/settingStates';

type Props = {
  book: Book | null;
  showing: boolean;
  close: () => void;
};

const RemoveBookModal: React.FC<Props> = (props: Props) => {
  const navigate = useNavigate();
  const [dontAskAgain, setDontAskAgain] = useState(false);
  const setBookList = useSetRecoilState(bookListState);
  const setConfirmRemoveSeries = useSetRecoilState(confirmRemoveSeriesState);

  const removeFunc = () => {
    if (props.book !== null) {
      removeBook(props.book, setBookList);

      if (dontAskAgain) setConfirmRemoveSeries(false);
      navigate(routes.EBOOKS);
    }
    props.close();
  };

  useEffect(() => {
    setDontAskAgain(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.showing]);

  return (
    <Modal
      opened={props.showing && props.book !== null}
      centered
      title="Remove Book"
      onClose={props.close}
    >
      <Text size="sm" mb="sm">
        Are you sure you want to remove{' '}
        <Text color="teal" inherit component="span" italic>
          {props.book?.title}
        </Text>{' '}
        from your library?
      </Text>
      <Checkbox
        mt="xs"
        label="Don't ask again"
        checked={dontAskAgain}
        onChange={(e) => setDontAskAgain(e.target.checked)}
      />
      <Group position="right" mt="sm">
        <Button variant="default" onClick={props.close}>
          Cancel
        </Button>
        <Button color="red" onClick={removeFunc}>
          Remove from library
        </Button>
      </Group>
    </Modal>
  );
};

export default RemoveBookModal;
