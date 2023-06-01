import firestore from "@react-native-firebase/firestore";
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Post } from "../components";


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
        await firestore().collection('friend_requests').doc(friendId).update({
            requests: firestore.FieldValue.arrayUnion(userId),
        });
    } catch (err) {
        console.log(err);
    }
}

export const fetchFriendRequests = async (userId: string) => {
    try {
        const friendRequests = await firestore().collection('friend_requests').doc(userId).get();
        return friendRequests.data()?.requests;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export const acceptFriendRequest = async (userId: string, friendId: string) => {
    try {
        await firestore().collection('friend_requests').doc(userId).update({
            requests: firestore.FieldValue.arrayRemove(friendId),
        });

        await firestore().collection('friend_requests').doc(friendId).update({
            requests: firestore.FieldValue.arrayRemove(userId),
        });

        await firestore().collection('friends').doc(userId).update({
            friends: firestore.FieldValue.arrayUnion(friendId),
        });

        await firestore().collection('friends').doc(friendId).update({
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
        const friendsArray = friends.data()?.friends;
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
