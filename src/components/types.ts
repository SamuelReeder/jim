import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

// some possible tags that I could provide:
// - Progress
// - Personal Record

// for progress pics specifically, will calculate how often they post a progress pic and track it
//

export type AppTabsParamList = {
    Profile: undefined,
    Search: undefined;
    Statistics: undefined;
    Home: undefined;
};

export type AppStackParamList = {
    Tabs: undefined;
    UserProfile: undefined;
    Post: { post: Post };
    EditProfile: undefined;
    Friends: { account?: string, screen?: string };
    CreatePostStack: undefined;
};

export type Post = {
    id: string;
    userId: string;
    description: string;
    comments: string[];
    likes: number;
    timestamp: FirebaseFirestoreTypes.FieldValue;
    pinned: boolean;
    tags: string[];
    media: Media[];
};

export type Media = {
    type: string;
    url: string;
    resolution: number[];
    aspectRatio: number[];
    thumbnail?: string;
    duration?: number;
    size: number;
}

export type User = {
    uid: string;
    username: string;
    displayName: string;
    metadata: any | null;
    photoURL: string;
    private: boolean;
    bio?: string;
    following?: any;
    followers?: any;
    closeFriends?: any;
    streaks?: {
        daily: number;
        weekly: number;
        monthly: number;
    }
    stats?: {
        state: string | null; // whether bulking ("bulk") or cutting ("cut")
        bodyweight: number | null;
        bodyfat: number | null;
        height: number | null;
        age: number | null;
        benchMax: number | null;
        squatMax: number | null;
        deadliftMax: number | null;
    } | null;
}

export type Comment = {
    id: string;
    userId: string;
    postId: string;
    comment: string;
    timestamp: FirebaseFirestoreTypes.FieldValue;
}

export type FriendRequest = {
    id: string;
    userId: string;
    friendId: string;
    timestamp: FirebaseFirestoreTypes.FieldValue;
}

export type Friend = {
    id: string;
    // userId: string;
    friendId: string;
    timestamp: FirebaseFirestoreTypes.FieldValue;
}

// TODO: figure out how to implement the user stats in the profile header