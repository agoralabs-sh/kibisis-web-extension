import {
  Alert,
  Box,
  Heading,
  ListItem,
  OrderedList,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import React from 'react';
import { Components } from 'react-markdown';

export default function createComponents(defaultTextColor: string): Components {
  return {
    blockquote: ({ children }) => (
      <Alert status="info" variant="left-accent">
        {children}
      </Alert>
    ),
    h1: ({ children }) => (
      <Heading color={defaultTextColor} size="lg" textAlign="left">
        {String(children)}
      </Heading>
    ),
    h2: ({ children }) => (
      <Heading color={defaultTextColor} size="md" textAlign="left">
        {String(children)}
      </Heading>
    ),
    h3: ({ children }) => (
      <Heading color={defaultTextColor} size="sm" textAlign="left">
        {String(children)}
      </Heading>
    ),
    li: ({ children, index, ordered }) => (
      <ListItem>
        <Text color={defaultTextColor} fontSize="sm" textAlign="left">
          {String(children)}
        </Text>
      </ListItem>
    ),
    ol: ({ children }) => (
      <Box>
        <OrderedList>{children}</OrderedList>
      </Box>
    ),
    p: ({ children }) => (
      <Text color={defaultTextColor} fontSize="sm" textAlign="left">
        {String(children)}
      </Text>
    ),
    strong: ({ children }) => <strong>{String(children)}</strong>,
    ul: ({ children }) => (
      <Box>
        <UnorderedList>{children}</UnorderedList>
      </Box>
    ),
  };
}
