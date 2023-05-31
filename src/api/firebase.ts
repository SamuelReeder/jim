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
