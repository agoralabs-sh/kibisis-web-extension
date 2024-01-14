interface IPublishResponse {
  item_id: string;
  kind: 'chromewebstore#item';
  status: string[];
  statusDetail: string[];
}

export default IPublishResponse;
