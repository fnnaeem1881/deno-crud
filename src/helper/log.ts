
import {
    Application,
    Router,
    Context,
    Status,
  } from "https://deno.land/x/oak/mod.ts";

export const logInfo = (message: string): void => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] INFO: ${message}`;
    console.log(logMessage);
    writeLogFile(logMessage);
  };
  
  export const logError = (message: string): void => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ERROR: ${message}`;
    console.error(logMessage);
    writeLogFile(logMessage);
  };
  
  const writeLogFile = async (logMessage: string): Promise<void> => {
    try {
      const logFilePath = "./logs/app.log"; // Adjust the path as needed
      await Application.writeTextFile(logFilePath, `${logMessage}\n`, { append: true });
    } catch (error) {
      console.error(`Error writing to log file: ${error.message}`);
    }
  };