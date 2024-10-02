/**
 * @property {number} createdAt - a timestamp (in milliseconds) when this account was created in storage.
 * @property {string} id - a unique identifier (in UUIDv4 format).
 * @property {string} name - The name of the group. Limited to 32 bytes.
 */
interface IAccountGroup {
  createdAt: number;
  id: string;
  name: string;
}

export default IAccountGroup;
