import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type Post = {
    id: string;
    userId: string;
    imageUrl: string;
    comments: string[];
    likes: number;
    timestamp: FirebaseFirestoreTypes.FieldValue;
    pinned: boolean;
    tags?: string[];
};

export type User = {
    username: string;
    displayName: string | null;
    metadata: any | null;
    photoURL: string | null;
    streaks: {
        daily: number;
        weekly: number;
        monthly: number;
    }
}

export type Comment = {
    id: string;
    userId: string;
    postId: string;
    comment: string;
    timestamp: FirebaseFirestoreTypes.FieldValue;
}

// TODO: figure out how to implement the user stats in the profile header