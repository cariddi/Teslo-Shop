export enum ServerEvents {
  ClientsUpdated = 'clients-updated',
  Connect = 'connect',
  Disconnect = 'disconnect',
  ServerMsg = 'message-from-server',
}

export enum ClientEvents {
  ClientMsg = 'message-from-client',
}

export interface ServerMsgPayload {
  fullName: string;
  message: string;
}
