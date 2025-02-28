import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { Chatstate } from './context/Chatprovider';
import { Avatar, Tooltip } from '@chakra-ui/react';
import { isSameSender, isLastMessage } from '../config/chatlogic';

export const ScrollableChat = ({ messages }) => {
  const { user } = Chatstate();
  return (
    <ScrollableFeed>
      {messages && messages.map((m, i) => (
        <div
          style={{
            display: 'flex',
            justifyContent: m.sender._id === user._id ? 'flex-end' : 'flex-start',
            marginBottom: '10px',  
          }}
          key={m._id}
        >
          {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
            <Tooltip label={m.sender.name} placement="bottom">
              <Avatar
                mt="7px"
                mr={1}
                size="sm"
                cursor="pointer"
                name={m.sender.name}
                src={m.sender.pic}
              />
            </Tooltip>
          )}
          <span
            style={{
              backgroundColor: m.sender._id === user._id ? '#BEE3F8' : '#B9F5D0',
              borderRadius: '20px',
              padding: '5px 15px',
              maxWidth: '75%',
              wordBreak: 'break-word',  
            }}
          >
            {m.content}
          </span>
        </div>
      ))}
    </ScrollableFeed>
  );
};
