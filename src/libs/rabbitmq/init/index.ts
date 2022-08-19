import { Channel } from "amqplib";
import amqp from 'amqplib/callback_api'
import { RABBIT_URL } from "../../../utils/const";
import { logger } from "../../logs";

class RABBIT {
  public channel: Channel;
  public queues: any;
  constructor() {
    this.channel = null;
    this.queues = {};
  }

  initChannel() {
    return new Promise((resolve, reject) => {
      let channel = this.channel;
      if (channel) {
        return resolve(channel);
      }
      amqp
        .connect(RABBIT_URL, async (error: any, conn: any) => {
          if (error) {
            logger.error("amqp connection failed, please check it carefully:");
            logger.error(error);
            return reject(error);
          }
          logger.info("Connect rabbit success.");
          channel = await conn.createChannel();
          this.channel = channel;
          return resolve(channel);
        });
    });
  }

  getChannel() {
    return this.channel;
  }

  initQueue(queueName: any, durable = true) {
    let channel;
    try {
      channel = this.getChannel();
    } catch (error) {
      logger.error("initQueue error:");
      logger.error(error);
      throw error;
    }

    if (!this.queues[queueName]) {
      this.queues[queueName] = channel.assertQueue(queueName, { durable });
    }
    return this.queues[queueName];
  }

  async sendDataToRabbit(queueName: any, data: any) {
    if (!data || !(typeof data === "object" || typeof data === "string")) {
      throw Error("Data must be object or string");
    }
    if (typeof data === "object") {
      data = JSON.stringify(data);
    }
    try {
      if (!this.channel) {
        await this.initChannel();
      }
      return this.channel.sendToQueue(queueName, Buffer.from(data), { persistent: true });
    } catch (error) {
      logger.error("sendDataToRabbit error:");
      logger.error(error);
      throw error;
    }
  }

  /**
   *
   * @param queueName
   * @param callback
   * @param options
   * @param options.noAck, if need to make sure the message proceed let set noAck = false
   */
  consumeData(queueName: any, callback: any, options?: any) {
    // tslint:disable-next-line: max-classes-per-file
    class Setting {
      public options: any;
      public noAck: any;
      constructor() {
        this.options = options;
        this.noAck = (options && options.noAck) || false;
      }
    }

    const setting = new Setting();
    if (!queueName) {
      throw new Error("You must implement queueName in consumer child");
    }

    this.channel.consume(
      queueName,
      (msg: any) => {
        callback(msg, this.channel);
      },
      {
        noAck: setting.noAck,
      }
    );
  }
}

export default new RABBIT();
