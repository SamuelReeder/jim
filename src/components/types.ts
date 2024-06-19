import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

// some possible tags that I could provide:
// - Progress
// - Personal Record
// for progress pics specifically, will calculate how often they post a progress pic and track it
//

export enum Tags {
    Progress = "Progress",
    PersonalRecord = "PR",
    Miscellaneous = "Misc",
}

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
    Stat: { stat: string };
    Settings: undefined;
};

export type Post = {
    id: string;
    userId: string;
    description: string;
    comments: string[];
    currentLikeDocId?: number;
    likes?: any;
    likesCount: number;
    timestamp: FirebaseFirestoreTypes.FieldValue;
    pinned: boolean;
    tags: Tags[];
    media: Media[];
};

// export type Stat = {
//     id: string;
//     userId: string;
// }

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
    lastPostDate?: any;
    streaks: {
        daily: number;
        weekly: number;
        monthly: number;
    }
    stats: Stat[] | null;
}

export enum StatMetric {
    Priority = "Priority",
    State = "State",
    Calories = "Calories",
    BenchPress = "Bench press",
    Squats = "Squats",
    Deadlift = "Deadlift",
    PullUps = "Pull ups",
    PushUps = "Push ups",
    BicepCurls = "Bicep curls",
    ShoulderPress = "Shoulder press",
    LateralRaises = "Lateral raises",
    FrontRaises = "Front raises",
    SitUps = "Sit ups",
}

export enum Priority {
    Aesthetics = "Aesthetics",
    Powerlifting = "Powerlifting",
    Strongman = "Strongman",
    Bodybuilding = "Bodybuilding",
    Crossfit = "Crossfit",
    Endurance = "Endurance",
    Fitness = "Fitness",
    Health = "Health",
}

export enum State {
    Cutting = "Cutting",
    Bulking = "Bulking",
    Maintenance = "Maintenance",
}

export type StatMetricValues = {
    [StatMetric.Priority]: Priority,
    [StatMetric.State]: State,
    [StatMetric.Calories]: number,
    [StatMetric.BenchPress]: number,
    [StatMetric.Squats]: number,
    [StatMetric.Deadlift]: number,
    [StatMetric.PullUps]: number,
    [StatMetric.PushUps]: number,
    [StatMetric.BicepCurls]: number,
    [StatMetric.ShoulderPress]: number,
    [StatMetric.LateralRaises]: number,
    [StatMetric.FrontRaises]: number,
    [StatMetric.SitUps]: number,
};

// Define a helper type that maps a metric to its value
type MetricValue<M extends StatMetric> = M extends keyof StatMetricValues ? StatMetricValues[M] : never;

export type Stat<M extends StatMetric = StatMetric> = {
    metric: M;
    value: MetricValue<M>;
    timestamp: FirebaseFirestoreTypes.FieldValue;
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