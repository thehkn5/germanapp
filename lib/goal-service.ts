import { db } from "@/lib/firebase";
import { 
  doc, 
  collection, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp, 
  where,
  writeBatch
} from "firebase/firestore";
import { User } from "firebase/auth";

// Define types
export type GoalSubTask = {
  id: string;
  title: string;
  completed: boolean;
};

export type Goal = {
  id: string;
  title: string;
  description: string;
  category: "vocabulary" | "grammar" | "speaking" | "listening" | "reading" | "writing" | "general";
  targetDate: Date;
  progress: number;
  status: "not_started" | "in_progress" | "completed";
  subGoals: GoalSubTask[];
  metrics: {
    timeSpent: number; // in minutes
    sessionsCompleted: number;
  };
  createdAt: Date;
  lastUpdated: Date;
  userId: string;
  isPublic?: boolean;
  tags?: string[];
};

class GoalService {
  // Create a new goal
  async createGoal(
    user: User,
    title: string,
    description: string,
    category: Goal['category'],
    targetDate: Date
  ): Promise<string> {
    try {
      if (!user) {
        console.error("Error: User is not authenticated");
        throw new Error("User must be authenticated to create a goal");
      }

      console.log("Creating goal for user:", user.uid);

      // First, ensure the user document exists
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        console.log("User document doesn't exist, creating it...");
        await setDoc(userDocRef, {
          email: user.email,
          displayName: user.displayName || user.email?.split("@")[0] || "User",
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        });
        console.log("User document created successfully");
      }

      // Generate a unique ID
      const goalId = crypto.randomUUID();
      console.log("Generated goal ID:", goalId);
      
      // Prepare the goal data
      const goalData = {
        title,
        description: description || "",
        category,
        targetDate,
        progress: 0,
        status: "not_started",
        subGoals: [],
        metrics: {
          timeSpent: 0,
          sessionsCompleted: 0
        },
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        userId: user.uid,
        isPublic: false
      };
      
      // Create the goal document in the goals collection
      const goalsCollection = collection(db, "goals");
      const goalDocRef = doc(goalsCollection, goalId);
      
      await setDoc(goalDocRef, goalData);
      console.log("Goal document created successfully in 'goals' collection");
      
      // Also create a user-goal relation for quick access
      const userGoalsCollection = collection(db, "users", user.uid, "user_goals");
      await setDoc(doc(userGoalsCollection, goalId), {
        goalId,
        createdAt: serverTimestamp()
      });
      
      return goalId;
    } catch (error) {
      console.error("Error creating goal:", error);
      throw error;
    }
  }

  // Get all goals for a user
  async getUserGoals(userId: string): Promise<Goal[]> {
    try {
      // Query the goals collection for documents with matching userId
      const goalsQuery = query(
        collection(db, "goals"),
        where("userId", "==", userId),
        orderBy("lastUpdated", "desc")
      );
      
      const snapshot = await getDocs(goalsQuery);
      
      const goals: Goal[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        goals.push({
          id: doc.id,
          title: data.title || "Untitled Goal",
          description: data.description || "",
          category: data.category,
          targetDate: data.targetDate?.toDate() || new Date(),
          progress: data.progress || 0,
          status: data.status || "not_started",
          subGoals: data.subGoals || [],
          metrics: {
            timeSpent: data.metrics?.timeSpent || 0,
            sessionsCompleted: data.metrics?.sessionsCompleted || 0
          },
          createdAt: data.createdAt?.toDate() || new Date(),
          lastUpdated: data.lastUpdated?.toDate() || new Date(),
          userId: data.userId,
          isPublic: data.isPublic || false,
          tags: data.tags || []
        });
      });
      
      return goals;
    } catch (error) {
      console.error("Error fetching goals:", error);
      throw error;
    }
  }

  // Get a single goal by ID
  async getGoal(goalId: string, userId: string): Promise<Goal | null> {
    try {
      const goalRef = doc(db, "goals", goalId);
      const docSnap = await getDoc(goalRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      const data = docSnap.data();
      
      // Check permissions
      if (data.userId !== userId && !data.isPublic) {
        // Check if user is admin
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists() || !userDoc.data().isAdmin) {
          throw new Error("You don't have permission to access this goal");
        }
      }
      
      return {
        id: docSnap.id,
        title: data.title || "Untitled Goal",
        description: data.description || "",
        category: data.category,
        targetDate: data.targetDate?.toDate() || new Date(),
        progress: data.progress || 0,
        status: data.status || "not_started",
        subGoals: data.subGoals || [],
        metrics: {
          timeSpent: data.metrics?.timeSpent || 0,
          sessionsCompleted: data.metrics?.sessionsCompleted || 0
        },
        createdAt: data.createdAt?.toDate() || new Date(),
        lastUpdated: data.lastUpdated?.toDate() || new Date(),
        userId: data.userId,
        isPublic: data.isPublic || false,
        tags: data.tags || []
      };
    } catch (error) {
      console.error("Error fetching goal:", error);
      throw error;
    }
  }

  // Update goal details
  async updateGoal(goalId: string, userId: string, updates: Partial<Omit<Goal, "id" | "userId" | "createdAt">>): Promise<void> {
    try {
      const goalRef = doc(db, "goals", goalId);
      const docSnap = await getDoc(goalRef);
      
      if (!docSnap.exists()) {
        throw new Error("Goal not found");
      }
      
      const data = docSnap.data();
      
      // Check permissions
      if (data.userId !== userId) {
        // Check if user is admin
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists() || !userDoc.data().isAdmin) {
          throw new Error("You don't have permission to update this goal");
        }
      }
      
      // Update the goal
      await updateDoc(goalRef, {
        ...updates,
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating goal:", error);
      throw error;
    }
  }

  // Add a subtask to a goal
  async addSubGoal(goalId: string, userId: string, title: string): Promise<string> {
    try {
      const goalRef = doc(db, "goals", goalId);
      const docSnap = await getDoc(goalRef);
      
      if (!docSnap.exists()) {
        throw new Error("Goal not found");
      }
      
      const data = docSnap.data();
      
      // Check permissions
      if (data.userId !== userId) {
        // Check if user is admin
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists() || !userDoc.data().isAdmin) {
          throw new Error("You don't have permission to update this goal");
        }
      }
      
      // Create subgoal with unique ID
      const subGoalId = crypto.randomUUID();
      const subGoal = {
        id: subGoalId,
        title,
        completed: false
      };
      
      // Get current subgoals
      const currentSubGoals = data.subGoals || [];
      
      // Update the goal with the new subgoal
      await updateDoc(goalRef, {
        subGoals: [...currentSubGoals, subGoal],
        lastUpdated: serverTimestamp()
      });
      
      return subGoalId;
    } catch (error) {
      console.error("Error adding subgoal:", error);
      throw error;
    }
  }

  // Update a subgoal (toggle completion)
  async updateSubGoal(goalId: string, userId: string, subGoalId: string, completed: boolean): Promise<void> {
    try {
      const goalRef = doc(db, "goals", goalId);
      const docSnap = await getDoc(goalRef);
      
      if (!docSnap.exists()) {
        throw new Error("Goal not found");
      }
      
      const data = docSnap.data();
      
      // Check permissions
      if (data.userId !== userId) {
        // Check if user is admin
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists() || !userDoc.data().isAdmin) {
          throw new Error("You don't have permission to update this goal");
        }
      }
      
      // Get current subgoals
      const currentSubGoals = data.subGoals || [];
      
      // Find and update the specific subgoal
      const updatedSubGoals = currentSubGoals.map((subGoal: any) => {
        if (subGoal.id === subGoalId) {
          return {
            ...subGoal,
            completed
          };
        }
        return subGoal;
      });
      
      // Calculate new progress based on completed subgoals
      const totalSubGoals = updatedSubGoals.length;
      const completedSubGoals = updatedSubGoals.filter((sg: any) => sg.completed).length;
      const progress = totalSubGoals > 0 ? Math.round((completedSubGoals / totalSubGoals) * 100) : 0;
      
      // Update status based on progress
      let status = data.status;
      if (progress === 0) {
        status = "not_started";
      } else if (progress === 100) {
        status = "completed";
      } else {
        status = "in_progress";
      }
      
      // Update the goal with the updated subgoals and progress
      await updateDoc(goalRef, {
        subGoals: updatedSubGoals,
        progress,
        status,
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating subgoal:", error);
      throw error;
    }
  }

  // Delete a goal
  async deleteGoal(goalId: string, userId: string): Promise<void> {
    try {
      const goalRef = doc(db, "goals", goalId);
      const docSnap = await getDoc(goalRef);
      
      if (!docSnap.exists()) {
        throw new Error("Goal not found");
      }
      
      const data = docSnap.data();
      
      // Check permissions
      if (data.userId !== userId) {
        // Check if user is admin
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists() || !userDoc.data().isAdmin) {
          throw new Error("You don't have permission to delete this goal");
        }
      }
      
      // Create a batch
      const batch = writeBatch(db);
      
      // Delete the goal
      batch.delete(goalRef);
      
      // Delete the user-goal relation
      const userGoalRef = doc(db, "users", data.userId, "user_goals", goalId);
      batch.delete(userGoalRef);
      
      // Commit the batch
      await batch.commit();
    } catch (error) {
      console.error("Error deleting goal:", error);
      throw error;
    }
  }

  // Update goal metrics (time spent and sessions)
  async updateGoalMetrics(goalId: string, userId: string, updates: {
    timeSpent?: number; // additional minutes
    sessionsCompleted?: number; // additional sessions
  }): Promise<void> {
    try {
      const goalRef = doc(db, "goals", goalId);
      const docSnap = await getDoc(goalRef);
      
      if (!docSnap.exists()) {
        throw new Error("Goal not found");
      }
      
      const data = docSnap.data();
      
      // Check permissions
      if (data.userId !== userId) {
        throw new Error("You don't have permission to update this goal");
      }
      
      // Get current metrics
      const currentMetrics = data.metrics || {
        timeSpent: 0,
        sessionsCompleted: 0
      };
      
      // Update metrics by adding to existing values
      const updatedMetrics = {
        timeSpent: currentMetrics.timeSpent + (updates.timeSpent || 0),
        sessionsCompleted: currentMetrics.sessionsCompleted + (updates.sessionsCompleted || 0)
      };
      
      // Update the goal with the updated metrics
      await updateDoc(goalRef, {
        metrics: updatedMetrics,
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating goal metrics:", error);
      throw error;
    }
  }
}

// Create and export a singleton instance
export const goalService = new GoalService(); 