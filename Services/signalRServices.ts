// services/signalRService.ts
import * as signalR from '@microsoft/signalr';
import { 
  messageReceived, 
  setConnectionStatus 
} from '@/store/slices/chatSlice';

// Dynamic store access to avoid circular dependency
const getStore = async () => {
  const { store } = await import('@/store/store');
  return store;
};

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private reconnectInterval: NodeJS.Timeout | null = null;

  async connect(token?: string) {
    try {
      const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL;
      const url = `${HUB_URL}/hubs/chat`;
      
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(url, {
          accessTokenFactory: () => token || '',
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // Setup event handlers
      this.setupEventHandlers();

      await this.connection.start();
      console.log('SignalR Connected');
      
      const store = await getStore();
      store.dispatch(setConnectionStatus('connected'));
      
      // Setup reconnection handling
      this.setupReconnection();
      
    } catch (error) {
      console.error('SignalR Connection Error:', error);
      const store = await getStore();
      store.dispatch(setConnectionStatus('disconnected'));
      this.scheduleReconnect();
    }
  }

  private setupEventHandlers() {
    if (!this.connection) return;

    this.connection.on('ReceiveMessage', async (message: any) => {
      const store = await getStore();
      store.dispatch(messageReceived(message));
    });

    this.connection.on('MessageDelivered', (messageId: string) => {
      // Backend might send number ID
      // TODO: implement when updateMessageStatus is added
    });

    this.connection.on('MessageRead', (messageId: string) => {
      // TODO: implement when updateMessageStatus is added
    });

    this.connection.onreconnecting(async (error) => {
      console.log('SignalR reconnecting:', error);
      const store = await getStore();
      store.dispatch(setConnectionStatus('reconnecting'));
    });

    this.connection.onreconnected(async (connectionId) => {
      console.log('SignalR reconnected:', connectionId);
      const store = await getStore();
      store.dispatch(setConnectionStatus('connected'));
    });

    this.connection.onclose(async (error) => {
      console.log('SignalR connection closed:', error);
      const store = await getStore();
      store.dispatch(setConnectionStatus('disconnected'));
      this.scheduleReconnect();
    });
  }

  private setupReconnection() {
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }
  }

  private scheduleReconnect() {
    if (this.reconnectInterval) return;

    this.reconnectInterval = setInterval(async () => {
      const store = await getStore();
      const state = store.getState();
      const { connectionStatus } = state.chat;
      
      if (connectionStatus === 'disconnected' && this.connection) {
        try {
          await this.connection.start();
          store.dispatch(setConnectionStatus('connected'));
          this.setupReconnection();
        } catch (error) {
          console.error('Reconnection failed:', error);
        }
      }
    }, 5000);
  }

  async disconnect() {
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }

    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
    
    const store = await getStore();
    store.dispatch(setConnectionStatus('disconnected'));
  }

  async sendMessage(threadId: number, content: string): Promise<string> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error('No SignalR connection');
    }

    try {
      await this.connection.invoke('SendMessage', threadId, content);
      return 'success';
    } catch (error) {
      console.error('Failed to send message via SignalR:', error);
      throw error;
    }
  }

  async joinThread(threadId: number) {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      return;
    }

    try {
      await this.connection.invoke('JoinThread', threadId);
    } catch (error) {
      console.error('Failed to join thread:', error);
    }
  }

  async leaveThread(threadId: number) {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      return;
    }

    try {
      await this.connection.invoke('LeaveThread', threadId);
    } catch (error) {
      console.error('Failed to leave thread:', error);
    }
  }

  getConnectionState() {
    return this.connection?.state || signalR.HubConnectionState.Disconnected;
  }
}

export const signalRService = new SignalRService();