import OpenAI from "openai";
import { getAuth } from 'firebase/auth';
import { db } from '../backend/FirebaseConfig';
import { ref, get } from "firebase/database";

const openai = new OpenAI({ apiKey: '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'});
const auth = getAuth();

const filterKeywordsOpenAI = async (text) => {

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", 
    content: "Parse the following text for keywords and put them into a list separated by a comma and a space: " + text }],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0].message.content;
};

const scoreMentor = (mentor) => {
  // create fake user for now
  user = {
    city: "Los Angeles",
    ethnicity: "Asian",
    state: "CA",
    interests: ["cooking", "hiking", "gardening"],
    description: "I am a 20 year old computer science student who loves to cook, hike, and garden." 
      + "I am outgoing and love to meet new people.",
    keywords: ["cooking", "hiking", "gardening", "outgoing", "computer science", "student"],
  };


  let score = 0;

  // check in see if in same city and state
  if (mentor.state == user.state) {
    score += 1;

    if (mentor.city == user.city) {
      score += 1;
    }
  }

  // check if mentor ethnicity matches
  if (mentor.ethnicity == user.ethnicity) {
    score += 1;
  }

  // check if mentor's interests match user's interests
  for (let interest of user.interests) {
    if (mentor.interests.includes(interest)) {
      score += 1;
    }
  }

  // check if mentor's keywords match user's keywords
  for (let keyword of user.keywords) {
    if (mentor.keywords.includes(keyword)) {
      score += 1;
    }
  }

  return score;
};

// update user data (from useEffect)
const getUserData = async (userId, setter) => {
  try {
    const userRef = ref(db, `users/${userId}`);
    const userSnapshot = await get(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.val();

      // set user data
      setter(userData);
      console.log(userData);
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

const getUserID = () => {
  const user = auth.currentUser;
  return user.uid;
};

export { filterKeywordsOpenAI, scoreMentor, getUserData, getUserID }