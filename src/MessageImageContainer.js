/* @flow */
import React from 'react';

import MessageImage from './MessageImage';

type Props = {
  currentMessage: {
    selectedUid: any,
    imageId: any,
  },
};

export default function MessageImageContainer({
  currentMessage: { selectedUid, imageId },
}: Props) {
  return <MessageImage roomId={selectedUid} imageId={imageId} />;
}
