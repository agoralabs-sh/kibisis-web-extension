import { generateAccount, TransactionType } from 'algosdk';
import {
  decode as decodeBase64,
  encodeURLSafe as encodeBase64URLSafe,
} from '@stablelib/base64';

// constants
import { ARC_0300_SCHEME } from '@extension/constants';

// config
import { networks } from '@extension/config';

// enums
import {
  ARC0300AuthorityEnum,
  ARC0300PathEnum,
  ARC0300QueryEnum,
} from '@extension/enums';

// types
import {
  IARC0300OfflineKeyRegistrationTransactionSendSchema,
  IARC0300OnlineKeyRegistrationTransactionSendSchema,
} from '@extension/types';
import type { IOptions } from './types';

// utils
import createLogger from '@common/utils/createLogger';
import parseURIToARC0300Schema from './parseURIToARC0300Schema';

describe(`${__dirname}#parseARC0300KeyRegistrationTransactionSendSchema()`, () => {
  const options: IOptions = {
    logger: createLogger('debug'),
    supportedNetworks: networks,
  };
  const baseURI = `${ARC_0300_SCHEME}://${ARC0300AuthorityEnum.Transaction}/${ARC0300PathEnum.Send}`;
  const commonQueryFragment = {
    [ARC0300QueryEnum.Sender]: generateAccount().addr,
    [ARC0300QueryEnum.Type]: TransactionType.keyreg,
  };
  const selectionKey = 'LrpLhvzr+QpN/bivh6IPpOaKGbGzTTB5lJtVfixmmgk=';
  const stateProofKey =
    'RpUpNWfZMjZ1zOOjv3MF2tjO714jsBt0GKnNsw0ihJ4HSZwci+d9zvUi3i67LwFUJgjQ5Dz4zZgHgGduElnmSA==';
  const voteFirst = '6000000';
  const voteKey = 'G/lqTV6MKspW6J8wH2d8ZliZ5XZVZsruqSBJMwLwlmo=';
  const voteKeyDilution = '1000';
  const voteLast = '6001000';

  it('should return null if the "selectionkey" param is missing', () => {
    // arrange
    const query = new URLSearchParams({
      ...commonQueryFragment,
      [ARC0300QueryEnum.StateProofKey]: encodeBase64URLSafe(
        decodeBase64(stateProofKey)
      ),
      [ARC0300QueryEnum.VoteFirst]: voteFirst,
      [ARC0300QueryEnum.VoteKey]: encodeBase64URLSafe(decodeBase64(voteKey)),
      [ARC0300QueryEnum.VoteKeyDilution]: voteKeyDilution,
      [ARC0300QueryEnum.VoteLast]: voteLast,
    });
    const uri = `${baseURI}?${query.toString()}`;
    // act
    const result = parseURIToARC0300Schema<
      | IARC0300OfflineKeyRegistrationTransactionSendSchema
      | IARC0300OnlineKeyRegistrationTransactionSendSchema
    >(uri, options);

    // assert
    expect(result).toBe(null);
  });

  it('should return null if the "stateproofkey" param is missing', () => {
    // arrange
    const query = new URLSearchParams({
      ...commonQueryFragment,
      [ARC0300QueryEnum.SelectionKey]: encodeBase64URLSafe(
        decodeBase64(selectionKey)
      ),
      [ARC0300QueryEnum.VoteFirst]: voteFirst,
      [ARC0300QueryEnum.VoteKey]: encodeBase64URLSafe(decodeBase64(voteKey)),
      [ARC0300QueryEnum.VoteKeyDilution]: voteKeyDilution,
      [ARC0300QueryEnum.VoteLast]: voteLast,
    });
    const uri = `${baseURI}?${query.toString()}`;
    // act
    const result = parseURIToARC0300Schema<
      | IARC0300OfflineKeyRegistrationTransactionSendSchema
      | IARC0300OnlineKeyRegistrationTransactionSendSchema
    >(uri, options);

    // assert
    expect(result).toBe(null);
  });

  it('should return null if the "votefirst" param is missing', () => {
    // arrange
    const query = new URLSearchParams({
      ...commonQueryFragment,
      [ARC0300QueryEnum.SelectionKey]: encodeBase64URLSafe(
        decodeBase64(selectionKey)
      ),
      [ARC0300QueryEnum.StateProofKey]: encodeBase64URLSafe(
        decodeBase64(stateProofKey)
      ),
      [ARC0300QueryEnum.VoteKey]: encodeBase64URLSafe(decodeBase64(voteKey)),
      [ARC0300QueryEnum.VoteKeyDilution]: voteKeyDilution,
      [ARC0300QueryEnum.VoteLast]: voteLast,
    });
    const uri = `${baseURI}?${query.toString()}`;
    // act
    const result = parseURIToARC0300Schema<
      | IARC0300OfflineKeyRegistrationTransactionSendSchema
      | IARC0300OnlineKeyRegistrationTransactionSendSchema
    >(uri, options);

    // assert
    expect(result).toBe(null);
  });

  it('should return null if the "votefirst" param is not numeric', () => {
    // arrange
    const query = new URLSearchParams({
      ...commonQueryFragment,
      [ARC0300QueryEnum.SelectionKey]: encodeBase64URLSafe(
        decodeBase64(selectionKey)
      ),
      [ARC0300QueryEnum.StateProofKey]: encodeBase64URLSafe(
        decodeBase64(stateProofKey)
      ),
      [ARC0300QueryEnum.VoteFirst]: 'not-numeric',
      [ARC0300QueryEnum.VoteKey]: encodeBase64URLSafe(decodeBase64(voteKey)),
      [ARC0300QueryEnum.VoteKeyDilution]: voteKeyDilution,
      [ARC0300QueryEnum.VoteLast]: voteLast,
    });
    const uri = `${baseURI}?${query.toString()}`;
    // act
    const result = parseURIToARC0300Schema<
      | IARC0300OfflineKeyRegistrationTransactionSendSchema
      | IARC0300OnlineKeyRegistrationTransactionSendSchema
    >(uri, options);

    // assert
    expect(result).toBe(null);
  });

  it('should return null if the "votekey" param is missing', () => {
    // arrange
    const query = new URLSearchParams({
      ...commonQueryFragment,
      [ARC0300QueryEnum.SelectionKey]: encodeBase64URLSafe(
        decodeBase64(selectionKey)
      ),
      [ARC0300QueryEnum.StateProofKey]: encodeBase64URLSafe(
        decodeBase64(stateProofKey)
      ),
      [ARC0300QueryEnum.VoteFirst]: voteFirst,
      [ARC0300QueryEnum.VoteKeyDilution]: voteKeyDilution,
      [ARC0300QueryEnum.VoteLast]: voteLast,
    });
    const uri = `${baseURI}?${query.toString()}`;
    // act
    const result = parseURIToARC0300Schema<
      | IARC0300OfflineKeyRegistrationTransactionSendSchema
      | IARC0300OnlineKeyRegistrationTransactionSendSchema
    >(uri, options);

    // assert
    expect(result).toBe(null);
  });

  it('should return null if the "votekeydilution" param is missing', () => {
    // arrange
    const query = new URLSearchParams({
      ...commonQueryFragment,
      [ARC0300QueryEnum.SelectionKey]: encodeBase64URLSafe(
        decodeBase64(selectionKey)
      ),
      [ARC0300QueryEnum.StateProofKey]: encodeBase64URLSafe(
        decodeBase64(stateProofKey)
      ),
      [ARC0300QueryEnum.VoteFirst]: voteFirst,
      [ARC0300QueryEnum.VoteKey]: encodeBase64URLSafe(decodeBase64(voteKey)),
      [ARC0300QueryEnum.VoteLast]: voteLast,
    });
    const uri = `${baseURI}?${query.toString()}`;
    // act
    const result = parseURIToARC0300Schema<
      | IARC0300OfflineKeyRegistrationTransactionSendSchema
      | IARC0300OnlineKeyRegistrationTransactionSendSchema
    >(uri, options);

    // assert
    expect(result).toBe(null);
  });

  it('should return null if the "votekeydilution" param is not numeric', () => {
    // arrange
    const query = new URLSearchParams({
      ...commonQueryFragment,
      [ARC0300QueryEnum.SelectionKey]: encodeBase64URLSafe(
        decodeBase64(selectionKey)
      ),
      [ARC0300QueryEnum.StateProofKey]: encodeBase64URLSafe(
        decodeBase64(stateProofKey)
      ),
      [ARC0300QueryEnum.VoteFirst]: voteFirst,
      [ARC0300QueryEnum.VoteKey]: encodeBase64URLSafe(decodeBase64(voteKey)),
      [ARC0300QueryEnum.VoteKeyDilution]: 'not-numeric',
      [ARC0300QueryEnum.VoteLast]: voteLast,
    });
    const uri = `${baseURI}?${query.toString()}`;
    // act
    const result = parseURIToARC0300Schema<
      | IARC0300OfflineKeyRegistrationTransactionSendSchema
      | IARC0300OnlineKeyRegistrationTransactionSendSchema
    >(uri, options);

    // assert
    expect(result).toBe(null);
  });

  it('should return null if the "votelast" param is missing', () => {
    // arrange
    const query = new URLSearchParams({
      ...commonQueryFragment,
      [ARC0300QueryEnum.SelectionKey]: encodeBase64URLSafe(
        decodeBase64(selectionKey)
      ),
      [ARC0300QueryEnum.StateProofKey]: encodeBase64URLSafe(
        decodeBase64(stateProofKey)
      ),
      [ARC0300QueryEnum.VoteFirst]: voteFirst,
      [ARC0300QueryEnum.VoteKey]: encodeBase64URLSafe(decodeBase64(voteKey)),
      [ARC0300QueryEnum.VoteKeyDilution]: voteKeyDilution,
    });
    const uri = `${baseURI}?${query.toString()}`;
    // act
    const result = parseURIToARC0300Schema<
      | IARC0300OfflineKeyRegistrationTransactionSendSchema
      | IARC0300OnlineKeyRegistrationTransactionSendSchema
    >(uri, options);

    // assert
    expect(result).toBe(null);
  });

  it('should return null if the "votelast" param is not numeric', () => {
    // arrange
    const query = new URLSearchParams({
      ...commonQueryFragment,
      [ARC0300QueryEnum.SelectionKey]: encodeBase64URLSafe(
        decodeBase64(selectionKey)
      ),
      [ARC0300QueryEnum.StateProofKey]: encodeBase64URLSafe(
        decodeBase64(stateProofKey)
      ),
      [ARC0300QueryEnum.VoteFirst]: voteFirst,
      [ARC0300QueryEnum.VoteKey]: encodeBase64URLSafe(decodeBase64(voteKey)),
      [ARC0300QueryEnum.VoteKeyDilution]: voteKeyDilution,
      [ARC0300QueryEnum.VoteLast]: 'not-numeric',
    });
    const uri = `${baseURI}?${query.toString()}`;
    // act
    const result = parseURIToARC0300Schema<
      | IARC0300OfflineKeyRegistrationTransactionSendSchema
      | IARC0300OnlineKeyRegistrationTransactionSendSchema
    >(uri, options);

    // assert
    expect(result).toBe(null);
  });

  it('should return a valid online schema', () => {
    // arrange
    const query = new URLSearchParams({
      ...commonQueryFragment,
      [ARC0300QueryEnum.SelectionKey]: encodeBase64URLSafe(
        decodeBase64(selectionKey)
      ),
      [ARC0300QueryEnum.StateProofKey]: encodeBase64URLSafe(
        decodeBase64(stateProofKey)
      ),
      [ARC0300QueryEnum.VoteFirst]: voteFirst,
      [ARC0300QueryEnum.VoteKey]: encodeBase64URLSafe(decodeBase64(voteKey)),
      [ARC0300QueryEnum.VoteKeyDilution]: voteKeyDilution,
      [ARC0300QueryEnum.VoteLast]: voteLast,
    });
    const uri = `${baseURI}?${query.toString()}`;
    // act
    const result =
      parseURIToARC0300Schema<IARC0300OnlineKeyRegistrationTransactionSendSchema>(
        uri,
        options
      );

    // assert
    if (!result) {
      throw new Error('failed to parse uri');
    }

    expect(result.scheme).toBe(ARC_0300_SCHEME);
    expect(result.authority).toBe(ARC0300AuthorityEnum.Transaction);
    expect(result.paths).toEqual([ARC0300PathEnum.Send]);
    expect(result.query[ARC0300QueryEnum.SelectionKey]).toBe(selectionKey);
    expect(result.query[ARC0300QueryEnum.StateProofKey]).toBe(stateProofKey);
    expect(result.query[ARC0300QueryEnum.VoteFirst]).toBe(voteFirst);
    expect(result.query[ARC0300QueryEnum.VoteKey]).toBe(voteKey);
    expect(result.query[ARC0300QueryEnum.VoteKeyDilution]).toBe(
      voteKeyDilution
    );
    expect(result.query[ARC0300QueryEnum.VoteLast]).toBe(voteLast);
  });

  it('should return a valid offline schema', () => {
    // arrange
    const uri = `${baseURI}?${new URLSearchParams(
      commonQueryFragment
    ).toString()}`;
    // act
    const result =
      parseURIToARC0300Schema<IARC0300OfflineKeyRegistrationTransactionSendSchema>(
        uri,
        options
      );

    // assert
    if (!result) {
      throw new Error('failed to parse uri');
    }

    expect(result.scheme).toBe(ARC_0300_SCHEME);
    expect(result.authority).toBe(ARC0300AuthorityEnum.Transaction);
    expect(result.paths).toEqual([ARC0300PathEnum.Send]);
  });
});
