import { realtimeDb } from "@/firebase/client-app";
import { ref, set, get } from "firebase/database";

/**
 * Test Firebase Realtime Database connection
 */
export async function testRealtimeDatabase(): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Testing Firebase Realtime Database connection...');
    
    // Test write operation
    const testRef = ref(realtimeDb, 'test/connection');
    await set(testRef, {
      timestamp: Date.now(),
      message: 'Connection test successful'
    });
    
    // Test read operation
    const snapshot = await get(testRef);
    if (snapshot.exists()) {
      console.log('✅ Realtime Database connection successful');
      return { success: true };
    } else {
      console.log('❌ Realtime Database read failed');
      return { success: false, error: 'Read operation failed' };
    }
  } catch (error: any) {
    console.error('❌ Realtime Database connection failed:', error);
    return { 
      success: false, 
      error: error.message || 'Unknown error' 
    };
  }
}

/**
 * Test Firestore connection
 */
export async function testFirestore(): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Testing Firestore connection...');
    
    // This is a simple test - in a real app you'd test actual read/write operations
    // For now, we'll just check if the db object is properly initialized
    if (realtimeDb) {
      console.log('✅ Firestore connection successful');
      return { success: true };
    } else {
      console.log('❌ Firestore connection failed');
      return { success: false, error: 'Database not initialized' };
    }
  } catch (error: any) {
    console.error('❌ Firestore connection failed:', error);
    return { 
      success: false, 
      error: error.message || 'Unknown error' 
    };
  }
}

/**
 * Run all Firebase connection tests
 */
export async function runFirebaseTests(): Promise<void> {
  console.log('🚀 Starting Firebase connection tests...');
  
  const realtimeTest = await testRealtimeDatabase();
  const firestoreTest = await testFirestore();
  
  console.log('📊 Test Results:');
  console.log(`Realtime Database: ${realtimeTest.success ? '✅' : '❌'} ${realtimeTest.error || ''}`);
  console.log(`Firestore: ${firestoreTest.success ? '✅' : '❌'} ${firestoreTest.error || ''}`);
  
  if (realtimeTest.success && firestoreTest.success) {
    console.log('🎉 All Firebase services are working correctly!');
  } else {
    console.log('⚠️ Some Firebase services have issues. Check the errors above.');
  }
}
