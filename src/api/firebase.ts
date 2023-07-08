import firestore from "@react-native-firebase/firestore";
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Post, User } from "../components";
import { firebase } from "@react-native-firebase/firestore";


export const gen = (length: number) => {
    const db = firestore();
    for (let i = 0; i < length; i++) {
        const ref = db.collection('metrics').doc(i.toString());
        ref.set({
            id: i,
            calories: Math.floor(Math.random() * 500),
            bench_press: Math.floor(Math.random() * 500),
            squats: Math.floor(Math.random() * 500),
            deadlift: Math.floor(Math.random() * 500),
            pull_ups: Math.floor(Math.random() * 500),
            push_ups: Math.floor(Math.random() * 500),
            bicep_curls: Math.floor(Math.random() * 500),
            shoulder_press: Math.floor(Math.random() * 500),
            lateral_raises: Math.floor(Math.random() * 500),
            front_raises: Math.floor(Math.random() * 500),
            sit_ups: Math.floor(Math.random() * 500)

        })
    }
}
export const createFirestoreUser = async (username: string, user: any) => {
    const userRef = firestore().collection('users').doc(user?.uid);

    // Set the user details in the 'users' collection
    await userRef.set({
        uid: user?.uid,
        username: username,
        displayName: user?.displayName,
        email: user?.email,
        metadata: user?.metadata,
        phoneNumber: user?.phoneNumber,
        photoURL: user?.photoURL,
        private: false,
        streaks: {
            daily: 0,
            weekly: 0,
            monthly: 0,
        },
    } as User);

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

export const updateUserProfile = async (uid: string, username: string, displayName: string, bio: string, photoURL: string) => {
    const userRef = firestore().collection('users').doc(uid);

    try {
        await userRef.update({
            username: username,
            displayName: displayName,
            bio: bio,
            photoURL: photoURL,
        });
        console.log('User profile updated successfully');
    } catch (error) {
        console.error('Error updating user profile: ', error);
    }
};


export const fetchUser = async (userId: string) => {
    try {
        const user = await firestore().collection('users').doc(userId).get();
        return user.data() as User;
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

// export const followUser = async (followerId: string, followedId: string) => {
//     const db = firestore();
//     const followedUserRef = db.collection('users').doc(followedId);

//     const followedUserDoc = await followedUserRef.get();

//     if (!followedUserDoc.exists) {
//         throw new Error(`User ${followedId} does not exist`);
//     }

//     const followedUserData = followedUserDoc.data();

//     if (followedUserData?.private) {
//         // If the user to be followed has a private account, send a follow request
//         const followRequestRef = followedUserRef.collection('requests').doc(followerId);
//         await followRequestRef.set({ followerId, timestamp: firestore.FieldValue.serverTimestamp() });
//     } else {
//         // If the user to be followed has a public account, add the follower directly
//         const followerRef = followedUserRef.collection('followers').doc(followerId);
//         await followerRef.set({ followerId, timestamp: firestore.FieldValue.serverTimestamp() });
//     }
// };
export const followUser = async (userId: string, followerId: string) => {
    const db = firestore();
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    if (!userData) {
        throw new Error(`User ${userId} does not exist`);
    }

    const followingRef = db.collection('users').doc(followerId).collection('following').doc(userId);
    const followRequestRef = userRef.collection('requests').doc(followerId);
    const followerRef = userRef.collection('followers').doc(followerId);

    // Start a batch
    const batch = db.batch();

    if (userData.private) {
        // Send follow request if user is private
        console.log("private")
        batch.set(followRequestRef, { followerId, timestamp: firestore.FieldValue.serverTimestamp() });
    } else {
        // Follow user directly if user is public
        console.log("public")
        batch.set(followerRef, { followerId, timestamp: firestore.FieldValue.serverTimestamp() });
        batch.set(followingRef, { userId, timestamp: firestore.FieldValue.serverTimestamp() }); // add to following of the follower
    }

    // Commit the batch
    await batch.commit();
};

export const getUserFollowing = async (userId: string) => {
    const db = firestore();
    const followingRef = db.collection('users').doc(userId).collection('following');

    const snapshot = await followingRef.get();
    const followingIds = snapshot.docs.map(doc => doc.id);

    if (followingIds.length === 0) {
        console.log("No followers found");
        return [];
    }

    // Get user documents for each follower
    const followingPromises = followingIds.map(followingId => db.collection('users').doc(followingId).get());
    const followingDocs = await Promise.all(followingPromises);

    // Check if user documents exist and map to their data
    const following = followingDocs.map(doc => {
        if (!doc.exists) {
            throw new Error(`User document for following ${doc.id} does not exist`);
        }

        return doc.data() as User;
    });

    return following;
};

export const getUserFollowers = async (userId: string) => {
    const db = firestore();
    const followersRef = db.collection('users').doc(userId).collection('followers');

    const snapshot = await followersRef.get();
    const followerIds = snapshot.docs.map(doc => doc.id);

    if (followerIds.length === 0) {
        console.log("No followers found");
        return [];
    }

    // Get user documents for each follower
    const followerPromises = followerIds.map(followerId => db.collection('users').doc(followerId).get());
    const followerDocs = await Promise.all(followerPromises);

    // Check if user documents exist and map to their data
    const followers = followerDocs.map(doc => {
        if (!doc.exists) {
            throw new Error(`User document for follower ${doc.id} does not exist`);
        }

        return doc.data() as User;
    });

    return followers;
};

export const getUserFollowRequests = async (userId: string) => {
    const db = firestore();
    const followRequestsRef = db.collection('users').doc(userId).collection('requests');

    const snapshot = await followRequestsRef.get();
    const followRequestIds = snapshot.docs.map(doc => doc.id);

    if (followRequestIds.length === 0) {
        console.log("No followers found")
        return [];
    }

    // Get user documents for each follow request
    const followRequestPromises = followRequestIds.map(requestId => db.collection('users').doc(requestId).get());
    const followRequestDocs = await Promise.all(followRequestPromises);

    // Check if user documents exist and map to their data
    const followRequests = followRequestDocs.map(doc => {
        if (!doc.exists) {
            throw new Error(`User document for follow request ${doc.id} does not exist`);
        }

        return doc.data() as User;
    });

    return followRequests;
};

export const acceptFollowRequest = async (userId: string, followerId: string) => {
    const db = firestore();
    const userRef = db.collection('users').doc(userId);
    const followRequestRef = userRef.collection('requests').doc(followerId);
    const followerRef = userRef.collection('followers').doc(followerId);
    const followingRef = db.collection('users').doc(followerId).collection('following').doc(userId);

    const followRequestDoc = await followRequestRef.get();

    if (!followRequestDoc.exists) {
        throw new Error(`Follow request from ${followerId} does not exist`);
    }

    // Start a batch
    const batch = db.batch();

    // Remove the follow request
    batch.delete(followRequestRef);

    // Add the follower
    batch.set(followerRef, { followerId, timestamp: firestore.FieldValue.serverTimestamp() });

    // Add to the other user's following
    batch.set(followingRef, { userId, timestamp: firestore.FieldValue.serverTimestamp() });

    // Commit the batch
    await batch.commit();
};

export const getRecentPostsFromFollowing = async (userId: string) => {
    const db = firestore();
    const userFollowingRef = db.collection('users').doc(userId).collection('following');
    const postsRef = db.collection('posts');

    // Get all the users this user is following.
    const followingDocs = await userFollowingRef.get();
    const followingIds = followingDocs.docs.map(doc => doc.id);

    // Fetch the most recent posts from the users this user is following.
    const postsQuery = postsRef.where('userId', 'in', followingIds).orderBy('timestamp', 'desc'); // .limit(10);
    const postsDocs = await postsQuery.get();

    // Convert the post documents to Post objects.
    const posts: Post[] = postsDocs.docs.map(doc => {
        const data = doc.data();
        return data as Post;
    });

    return posts;
};


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


// LIKES

export const likePost = async (postId: string, userId: string) => {
    const db = firestore();
    const postRef = db.collection('posts').doc(postId);
    const userRef = db.collection('users').doc(userId).collection('likedPosts').doc(postId);
  
    // Get the post document to find out which like document to write to
    const postSnapshot = await postRef.get();
    const post = postSnapshot.data();
    const currentLikeDocId = post?.currentLikeDocId;
    const likesRef = postRef.collection('likes').doc(currentLikeDocId.toString());
    
    console.log(currentLikeDocId)
    // Attempt to add the like to the current like document
    try {
      await likesRef.update({
        [userId]: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      // If the update fails because the document is full or doesn't exist,
      // create a new like document and update the post document to point to it
      const newLikeDocId = currentLikeDocId + 1;
      const newLikesRef = postRef.collection('likes').doc(newLikeDocId.toString());
  
      await newLikesRef.set({
        [userId]: firestore.FieldValue.serverTimestamp(),
      });
  
      await postRef.update({ currentLikeDocId: newLikeDocId });
    }
  
    // Increment the likesCount in the post
    await postRef.update({
      likesCount: firestore.FieldValue.increment(1),
    });
  
    // Add to the user's liked posts
    await userRef.set({ timestamp: firestore.FieldValue.serverTimestamp() });
  };
  
  


export const hasUserLikedPost = async (postId: string, userId: string) => {
    const db = firestore();
    const likeRef = await db.collection('users').doc(userId).collection('likedPosts').doc(postId).get();
    
    return likeRef.exists;
}

export const getLikesForPost = async (postId: string) => {
    const db = firestore();
    const likesSnapshot = await db.collection('posts').doc(postId).collection('likes').doc('likeDoc').get();
    
    if (!likesSnapshot.exists) {
        // The document does not exist.
        return [];
    }

    return likesSnapshot.data()?.likes;
}

export const unlikePost = async (postId: string, userId: string) => {
    const db = firestore();
    const postRef = db.collection('posts').doc(postId);
    const likesRef = db.collection('posts').doc(postId).collection('likes').doc('likeDoc');
    const userRef = db.collection('users').doc(userId).collection('likedPosts').doc(postId);

    const likesSnapshot = await likesRef.get();

    if (!likesSnapshot.exists) {
        // The document does not exist.
        return;
    }
    const userLike = likesSnapshot.data()?.likes.find(like => like.userId === userId);

    // Remove from the likes array in the likes document
    await likesRef.update({
        likes: firestore.FieldValue.arrayRemove(userLike)
    });

    // Decrement the likesCount in the post
    await postRef.update({
        likesCount: firestore.FieldValue.increment(-1),
    });

    // Remove from the user's liked posts
    await userRef.delete();
}
