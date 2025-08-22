import Message from "../models/Message";

export class MessageCleanup {
  /**
   * Clean up old messages (older than 24 hours)
   */
  static async cleanupOldMessages() {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const result = await Message.deleteMany({
        messageDate: { $lt: oneDayAgo }
      });

      console.log(`Cleaned up ${result.deletedCount} old messages`);
      return result.deletedCount;
    } catch (error) {
      console.error("Error cleaning up old messages:", error);
      throw error;
    }
  }

  /**
   * Mark old messages as inactive instead of deleting them
   * This provides better audit trail
   */
  static async deactivateOldMessages() {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const result = await Message.updateMany(
        {
          messageDate: { $lt: oneDayAgo },
          isActive: true
        },
        {
          $set: { isActive: false }
        }
      );

      console.log(`Deactivated ${result.modifiedCount} old messages`);
      return result.modifiedCount;
    } catch (error) {
      console.error("Error deactivating old messages:", error);
      throw error;
    }
  }

  /**
   * Get statistics about messages
   */
  static async getMessageStats() {
    try {
      const totalMessages = await Message.countDocuments();
      const activeMessages = await Message.countDocuments({ isActive: true });
      const todayMessages = await Message.countDocuments({
        messageDate: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });

      return {
        total: totalMessages,
        active: activeMessages,
        today: todayMessages
      };
    } catch (error) {
      console.error("Error getting message stats:", error);
      throw error;
    }
  }
} 