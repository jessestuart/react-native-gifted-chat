/* @flow */

export type Message = {
  _id: number,
  createdAt: Date,
  image: string,
  imageId: string,
  selectedUid: any,
  text: string,
  timestamp: number,
  type: string,
  user: {
    _id: number,
    name: string,
    avatar: string,
  },
};

export type MessagePosition = 'left' | 'right';
