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
export type RoadmapStep = {
  id: string;
  title: string;
  description: string;
  type: "vocabulary" | "grammar" | "speaking" | "review" | "milestone";
  estimatedTime: number;
  priority: "high" | "medium" | "low";
  status: "not_started" | "in_progress" | "done";
  createdAt: Date;
};

export type Roadmap = {
  id: string;
  title: string;
  description: string;
  steps: RoadmapStep[];
  createdAt: Date;
  lastModified: Date;
  userId: string;
  isPublic?: boolean;
  tags?: string[];
};

class RoadmapService {
  // Create a new roadmap
  async createRoadmap(user: User, title: string, description: string): Promise<string> {
    try {
      if (!user) {
        console.error("Error: User is not authenticated");
        throw new Error("User must be authenticated to create a roadmap");
      }

      console.log("Creating roadmap for user:", user.uid);
      console.log("User email:", user.email);
      console.log("User display name:", user.displayName);

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
      } else {
        console.log("User document already exists");
      }

      // Generate a unique ID
      const roadmapId = crypto.randomUUID();
      console.log("Generated roadmap ID:", roadmapId);
      
      // Prepare the roadmap data
      const roadmapData = {
        title,
        description: description || "",
        steps: [],
        createdAt: serverTimestamp(),
        lastModified: serverTimestamp(),
        userId: user.uid,
        isPublic: false
      };
      
      console.log("Creating roadmap in collection 'roadmaps'");
      
      // Create the roadmap document in the roadmaps collection
      const roadmapsCollection = collection(db, "roadmaps");
      const roadmapDocRef = doc(roadmapsCollection, roadmapId);
      
      await setDoc(roadmapDocRef, roadmapData);
      console.log("Roadmap document created successfully in 'roadmaps' collection");
      
      // Also create a user-roadmap relation for quick access
      console.log("Creating user-roadmap relation");
      const userRoadmapsCollection = collection(db, "users", user.uid, "user_roadmaps");
      await setDoc(doc(userRoadmapsCollection, roadmapId), {
        roadmapId,
        createdAt: serverTimestamp()
      });
      console.log("User-roadmap relation created successfully");
      
      return roadmapId;
    } catch (error) {
      console.error("Error creating roadmap:", error);
      throw error;
    }
  }

  // Get all roadmaps for a user
  async getUserRoadmaps(userId: string): Promise<Roadmap[]> {
    try {
      // Query the roadmaps collection for documents with matching userId
      const roadmapsQuery = query(
        collection(db, "roadmaps"),
        where("userId", "==", userId),
        orderBy("lastModified", "desc")
      );
      
      const snapshot = await getDocs(roadmapsQuery);
      
      const roadmaps: Roadmap[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        roadmaps.push({
          id: doc.id,
          title: data.title || "Untitled Roadmap",
          description: data.description || "",
          steps: (data.steps || []).map((step: any) => ({
            ...step,
            createdAt: step.createdAt?.toDate() || new Date(),
          })),
          createdAt: data.createdAt?.toDate() || new Date(),
          lastModified: data.lastModified?.toDate() || new Date(),
          userId: data.userId,
          isPublic: data.isPublic || false,
          tags: data.tags || []
        });
      });
      
      return roadmaps;
    } catch (error) {
      console.error("Error fetching roadmaps:", error);
      throw error;
    }
  }

  // Get a single roadmap by ID
  async getRoadmap(roadmapId: string, userId: string): Promise<Roadmap | null> {
    try {
      const roadmapRef = doc(db, "roadmaps", roadmapId);
      const docSnap = await getDoc(roadmapRef);
      
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
          throw new Error("You don't have permission to access this roadmap");
        }
      }
      
      return {
        id: docSnap.id,
        title: data.title || "Untitled Roadmap",
        description: data.description || "",
        steps: (data.steps || []).map((step: any) => ({
          ...step,
          createdAt: step.createdAt?.toDate() || new Date(),
        })),
        createdAt: data.createdAt?.toDate() || new Date(),
        lastModified: data.lastModified?.toDate() || new Date(),
        userId: data.userId,
        isPublic: data.isPublic || false,
        tags: data.tags || []
      };
    } catch (error) {
      console.error("Error fetching roadmap:", error);
      throw error;
    }
  }

  // Update roadmap details
  async updateRoadmap(roadmapId: string, userId: string, updates: {
    title?: string;
    description?: string;
    isPublic?: boolean;
    tags?: string[];
  }): Promise<void> {
    try {
      const roadmapRef = doc(db, "roadmaps", roadmapId);
      const docSnap = await getDoc(roadmapRef);
      
      if (!docSnap.exists()) {
        throw new Error("Roadmap not found");
      }
      
      const data = docSnap.data();
      
      // Check permissions
      if (data.userId !== userId) {
        // Check if user is admin
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists() || !userDoc.data().isAdmin) {
          throw new Error("You don't have permission to update this roadmap");
        }
      }
      
      // Update the roadmap
      await updateDoc(roadmapRef, {
        ...updates,
        lastModified: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating roadmap:", error);
      throw error;
    }
  }

  // Add a step to a roadmap
  async addStep(roadmapId: string, userId: string, stepData: Omit<RoadmapStep, "id" | "createdAt">): Promise<string> {
    try {
      const roadmapRef = doc(db, "roadmaps", roadmapId);
      const docSnap = await getDoc(roadmapRef);
      
      if (!docSnap.exists()) {
        throw new Error("Roadmap not found");
      }
      
      const data = docSnap.data();
      
      // Check permissions
      if (data.userId !== userId) {
        // Check if user is admin
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists() || !userDoc.data().isAdmin) {
          throw new Error("You don't have permission to update this roadmap");
        }
      }
      
      // Create step with unique ID
      const stepId = crypto.randomUUID();
      const step = {
        ...stepData,
        id: stepId,
        createdAt: serverTimestamp(),
        description: stepData.description || ""
      };
      
      // Get current steps
      const currentSteps = data.steps || [];
      
      // Update the roadmap with the new step
      await updateDoc(roadmapRef, {
        steps: [...currentSteps, step],
        lastModified: serverTimestamp()
      });
      
      return stepId;
    } catch (error) {
      console.error("Error adding step:", error);
      throw error;
    }
  }

  // Update a step in a roadmap
  async updateStep(roadmapId: string, userId: string, stepId: string, updates: Partial<Omit<RoadmapStep, "id" | "createdAt">>): Promise<void> {
    try {
      const roadmapRef = doc(db, "roadmaps", roadmapId);
      const docSnap = await getDoc(roadmapRef);
      
      if (!docSnap.exists()) {
        throw new Error("Roadmap not found");
      }
      
      const data = docSnap.data();
      
      // Check permissions
      if (data.userId !== userId) {
        // Check if user is admin
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists() || !userDoc.data().isAdmin) {
          throw new Error("You don't have permission to update this roadmap");
        }
      }
      
      // Get current steps
      const currentSteps = data.steps || [];
      
      // Find and update the specific step
      const updatedSteps = currentSteps.map((step: any) => {
        if (step.id === stepId) {
          return {
            ...step,
            ...updates,
            description: updates.description !== undefined ? (updates.description || "") : step.description
          };
        }
        return step;
      });
      
      // Update the roadmap with the updated steps
      await updateDoc(roadmapRef, {
        steps: updatedSteps,
        lastModified: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating step:", error);
      throw error;
    }
  }

  // Delete a roadmap
  async deleteRoadmap(roadmapId: string, userId: string): Promise<void> {
    try {
      const roadmapRef = doc(db, "roadmaps", roadmapId);
      const docSnap = await getDoc(roadmapRef);
      
      if (!docSnap.exists()) {
        throw new Error("Roadmap not found");
      }
      
      const data = docSnap.data();
      
      // Check permissions
      if (data.userId !== userId) {
        // Check if user is admin
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists() || !userDoc.data().isAdmin) {
          throw new Error("You don't have permission to delete this roadmap");
        }
      }
      
      // Create a batch
      const batch = writeBatch(db);
      
      // Delete the roadmap
      batch.delete(roadmapRef);
      
      // Delete the user-roadmap relation
      const userRoadmapRef = doc(db, "users", data.userId, "user_roadmaps", roadmapId);
      batch.delete(userRoadmapRef);
      
      // Commit the batch
      await batch.commit();
    } catch (error) {
      console.error("Error deleting roadmap:", error);
      throw error;
    }
  }
}

// Create and export a singleton instance
export const roadmapService = new RoadmapService(); 