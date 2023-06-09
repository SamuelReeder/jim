import firestore from "@react-native-firebase/firestore";
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Post } from "../components";

export const createFirestoreUser = async (username: string, user: any) => {
    const userRef = firestore().collection('users').doc(user?.uid);
    
    // Set the user details in the 'users' collection
    await userRef.set({
        username: username,
        displayName: user?.displayName,
        email: user?.email,
        metadata: user?.metadata,
        phoneNumber: user?.phoneNumber,
        photoURL: user?.photoURL,
        streaks: {
            daily: 0,
            weekly: 0,
            monthly: 0,
        },
    });

    // Initialize the 'requests' array in the 'friend_requests' collection for the user
    await firestore().collection('friend_requests').doc(user?.uid).set({
        requests: [],
    }, { merge: true });

    // await firestore().collection('pending_requests').doc(user?.uid).set({
    //     requests: [],
    // }, { merge: true });

    // Initialize the 'friends' array in the 'friends' collection for the user
    await firestore().collection('friends').doc(user?.uid).set({
        friends: [],
    }, { merge: true });

    // TODO:
    // Following maybe
}


export const fetchUser = async (userId: string) => {
    try {
        const user = await firestore().collection('users').doc(userId).get();
        return user.data();
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

export const fetchUserPosts = async (userId: string) => {
    try {
        const posts = await firestore().collection('posts')
            .where('userId', '==', userId)
            .orderBy('timestamp', 'desc')
            .get();

        let temp: Post[] = [];
        posts.forEach((doc) => {
            temp.push(
                doc.data() as Post,
            );
        });

        return temp;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export const fetchUserFollowing = async (userId: string) => {
    const userFollowing = await firestore().collection('following').doc(userId).get();
    return userFollowing.data()?.following;
}

export const sendFriendRequest = async (userId: string, friendId: string) => {
    try {
        const friendRequestsRef = firestore().collection('friend_requests').doc(friendId);

        // No need to check if document exists. Just update or set it.
        await friendRequestsRef.set({
            requests: firestore.FieldValue.arrayUnion(userId),
        }, { merge: true });

    } catch (err) {
        console.log(err);
    }
}


export const fetchFriendRequests = async (userId: string) => {
    try {
        const friendRequests = await firestore().collection('friend_requests').doc(userId).get();
        let friendsRequestsArray = friendRequests.data()?.requests;

        if (!friendsRequestsArray || friendsRequestsArray.length === 0) {
            return []; // Return an empty array if no friends
        }

        let temp: any[] = [];
        for (let i = 0; i < friendsRequestsArray.length; i++) {
            const friend = await fetchUser(friendsRequestsArray[i]);
            temp.push(friend);
        }

        return temp;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export const acceptFriendRequest = async (userId: string, friendId: string) => {
    try {
        const requestsRef = firestore().collection('friend_requests').doc(userId);
        const friendsRefUser = firestore().collection('friends').doc(userId);
        const friendsRefFriend = firestore().collection('friends').doc(friendId);

        const [requestsSnapshot, friendsSnapshotUser, friendsSnapshotFriend] = await Promise.all([
            requestsRef.get(),
            friendsRefUser.get(),
            friendsRefFriend.get(),
        ]);

        if (!requestsSnapshot.exists) {
            await requestsRef.set({ requests: [] });
        }

        if (!friendsSnapshotUser.exists) {
            await friendsRefUser.set({ friends: [] });
        }

        if (!friendsSnapshotFriend.exists) {
            await friendsRefFriend.set({ friends: [] });
        }

        await requestsRef.update({
            requests: firestore.FieldValue.arrayRemove(friendId),
        });

        await friendsRefUser.update({
            friends: firestore.FieldValue.arrayUnion(friendId),
        });

        await friendsRefFriend.update({
            friends: firestore.FieldValue.arrayUnion(userId),
        });
    } catch (err) {
        console.log(err);
    }
}


export const fetchFriends = async (userId: string) => {
    try {
        const friends = await firestore().collection('friends').doc(userId).get();
        return friends.data()?.friends;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export const fetchUserFriends = async (userId: string) => {
    try {
        const friends = await firestore().collection('friends').doc(userId).get();
        let friendsArray = friends.data()?.friends;

        // Check if friendsArray is undefined or empty
        if (!friendsArray || friendsArray.length === 0) {
            return []; // Return an empty array if no friends
        }

        let temp: any[] = [];
        for (let i = 0; i < friendsArray.length; i++) {
            const friend = await fetchUser(friendsArray[i]);
            temp.push(friend);
        }
        return temp;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export const fetchUserFriendPosts = async (userId: string) => {
    try {
        const friends = await fetchUserFriends(userId);
        if (!friends) {
            return null;
        }
        let temp: any[] = [];
        for (let i = 0; i < friends.length; i++) {
            const friendPosts = await fetchUserPosts(friends[i].id);
            if (!friendPosts) {
                continue;
            }
            temp.push(...friendPosts);
        }
        return temp;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export const removeFriend = async (userId: string, friendId: string) => {
    try {
        await firestore().collection('friends').doc(userId).update({
            friends: firestore.FieldValue.arrayRemove(friendId),
        });

        await firestore().collection('friends').doc(friendId).update({
            friends: firestore.FieldValue.arrayRemove(userId),
        });
    } catch (err) {
        console.log(err);
    }
}
