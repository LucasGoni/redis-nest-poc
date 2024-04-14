import { createClient } from 'redis';

// Create a Redis client
const client = createClient();
client.on('error', (err) => 
console.log('Redis Client Error', err));
client.connect();

// Function to perform atomic transaction
async function performTransaction() {
  try {
    // Start a multi command transaction
    const multiCommand = client.multi();
    // Add commands to the transaction
    multiCommand.set('key1', 'value1');
    multiCommand.set('key2', 'value2');
    multiCommand.set('key3', 'value3');
    // Execute the queued commands atomically
    const result = await multiCommand.exec();
    console.log('Transaction executed successfully:', result);
  } catch (error) {
    console.error('Error executing transaction:', error);
  }
}
// Perform the atomic transaction
performTransaction();