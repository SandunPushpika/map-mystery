import PubNub from "pubnub";

class ChannelService {
  private static pubnubInstance: PubNub | null;

  private constructor() {}

  public static getChannelConnection(
    userId: string,
    channelName: string,
    presenceEvent:
      | ((presence: PubNub.SubscriptionObject.Presence) => void)
      | undefined,
    connectionSucceeded: () => void,
    connectionFailed: (error: string) => void 
  ) {
    if (this.pubnubInstance) return this.pubnubInstance;

    this.pubnubInstance = new PubNub({
      subscribeKey: "sub-c-86cf3a13-7d13-47df-b9aa-fe1af4403567",
      publishKey: "pub-c-805f5a4e-cc7c-4683-9ea0-e45fe956d736",
      userId: userId
    });

    this.pubnubInstance.addListener({
      presence: presenceEvent,
      status: (event) => {
        console.log(event);
        if(event.category === 'PNConnectedCategory'){
            connectionSucceeded();
        }else if(event.category === 'PNNetworkIssuesCategory'){
            connectionFailed("Connection lost. Attempting to reconnect...");
        }else if(event.category === 'PNReconnectedCategory'){
            connectionSucceeded();
        }
      }
    });

    const channel = this.pubnubInstance.channel(channelName);
    const subscription = channel.subscription({
        receivePresenceEvents: true
    });
    subscription.subscribe();

    return this.pubnubInstance;
  }

  public static closeChannelConnection() {
    if (!this.pubnubInstance) return;
    this.pubnubInstance.removeAllListeners();
    this.pubnubInstance.destroy();
    this.pubnubInstance = null;
  }
}

export default ChannelService;