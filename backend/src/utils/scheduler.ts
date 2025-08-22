import { MessageCleanup } from "./cleanup";

export class MessageScheduler {
  private static cleanupInterval: NodeJS.Timeout | null = null;

  /**
   * Start the daily cleanup scheduler
   */
  static startDailyCleanup() {
    // Run cleanup every 24 hours
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    
    // Run initial cleanup
    this.runCleanup();
    
    // Schedule recurring cleanup
    this.cleanupInterval = setInterval(() => {
      this.runCleanup();
    }, TWENTY_FOUR_HOURS);

    console.log("Message cleanup scheduler started - running every 24 hours");
  }

  /**
   * Stop the cleanup scheduler
   */
  static stopDailyCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log("Message cleanup scheduler stopped");
    }
  }

  /**
   * Run the cleanup process
   */
  private static async runCleanup() {
    try {
      console.log("Starting daily message cleanup...");
      
      // Deactivate old messages instead of deleting them
      const deactivatedCount = await MessageCleanup.deactivateOldMessages();
      
      // Get stats
      const stats = await MessageCleanup.getMessageStats();
      
      console.log(`Daily cleanup completed:`, {
        deactivatedMessages: deactivatedCount,
        stats
      });
    } catch (error) {
      console.error("Error during daily cleanup:", error);
    }
  }


} 