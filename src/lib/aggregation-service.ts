
"use client";
import { db } from "@/firebase/client-app";
import { doc, getDoc, runTransaction } from "firebase/firestore";

/**
 * NOTE: In a real-world production application, these aggregation updates
 * would be handled by Cloud Functions triggered by Firestore document
 * onCreate, onUpdate, and onDelete events.
 *
 * This client-side simulation is for demonstration purposes to show how
 * the dashboard can be powered by aggregated data for high performance.
 */

export interface DashboardStats {
  totalPatients: number;
  totalEvaluations: number;
  totalReports: number;
  totalComparisons: number;
  thisMonthEvaluations: number;
}

const statsDocRef = (userId: string) => doc(db, "users", userId, "metadata", "stats");

/**
 * Simulates a Cloud Function that updates stats when an Anamnesis record is created.
 */
export async function handleAnamnesisCreated(userId: string, patientName: string) {
  const statsRef = statsDocRef(userId);

  try {
    await runTransaction(db, async (transaction) => {
      const statsDoc = await transaction.get(statsRef);
      
      let newTotalPatients = 0;
      let newTotalEvaluations = 1;
      let newThisMonthEvaluations = 1;

      if (statsDoc.exists()) {
        const currentStats = statsDoc.data() as DashboardStats;
        // This is a simplified check. A robust solution would check if it's truly a new patient.
        // For this demo, we assume a new evaluation might mean a new patient if we can't find them.
        newTotalPatients = currentStats.totalPatients + 1; // Simplified logic
        newTotalEvaluations = currentStats.totalEvaluations + 1;
        newThisMonthEvaluations = currentStats.thisMonthEvaluations + 1;
      }
      
      const newStats: DashboardStats = {
        totalPatients: newTotalPatients,
        totalEvaluations: newTotalEvaluations,
        totalReports: statsDoc.exists() ? statsDoc.data().totalReports : 0,
        totalComparisons: statsDoc.exists() ? statsDoc.data().totalComparisons : 0,
        thisMonthEvaluations: newThisMonthEvaluations,
      };

      transaction.set(statsRef, newStats, { merge: true });
    });
  } catch (error) {
    console.error("Transaction failed: ", error);
  }
}

/**
 * Simulates a Cloud Function that updates stats when a Report is created.
 */
export async function handleReportCreated(userId: string) {
  const statsRef = statsDocRef(userId);
  try {
    await runTransaction(db, async (transaction) => {
        const statsDoc = await transaction.get(statsRef);
        if (statsDoc.exists()) {
            transaction.update(statsRef, { totalReports: (statsDoc.data().totalReports || 0) + 1 });
        } else {
            transaction.set(statsRef, { totalReports: 1 }, { merge: true });
        }
    });
  } catch (e) {
    console.error("Transaction failed: ", e);
  }
}

/**
 * Simulates a Cloud Function that updates stats when a Comparison is created.
 */
export async function handleComparisonCreated(userId: string) {
    const statsRef = statsDocRef(userId);
    try {
        await runTransaction(db, async (transaction) => {
            const statsDoc = await transaction.get(statsRef);
            if (statsDoc.exists()) {
                transaction.update(statsRef, { totalComparisons: (statsDoc.data().totalComparisons || 0) + 1 });
            } else {
                transaction.set(statsRef, { totalComparisons: 1 }, { merge: true });
            }
        });
    } catch (e) {
        console.error("Transaction failed: ", e);
    }
}
