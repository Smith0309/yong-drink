import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { DrinkGoal, DailyDrinkRecord, DrinkGoalFormData, DailyRecordFormData } from './drink-types';

// 음주 목표 관련 함수들
export const createDrinkGoal = async (userId: string, goalData: DrinkGoalFormData) => {
  try {
    const goalRef = await addDoc(collection(db, 'drinkGoals'), {
      userId,
      sojuBottles: goalData.sojuBottles,
      beerCans: goalData.beerCans,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { id: goalRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

export const updateDrinkGoal = async (goalId: string, goalData: DrinkGoalFormData) => {
  try {
    const goalRef = doc(db, 'drinkGoals', goalId);
    await updateDoc(goalRef, {
      sojuBottles: goalData.sojuBottles,
      beerCans: goalData.beerCans,
      updatedAt: serverTimestamp(),
    });

    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getDrinkGoal = async (userId: string): Promise<DrinkGoal | null> => {
  try {
    const q = query(
      collection(db, 'drinkGoals'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }

    // 클라이언트에서 정렬 (인덱스 불필요)
    const docs = querySnapshot.docs.sort((a, b) => {
      const aTime = a.data().createdAt?.toDate() || new Date(0);
      const bTime = b.data().createdAt?.toDate() || new Date(0);
      return bTime.getTime() - aTime.getTime(); // 최신순
    });

    const doc = docs[0];
    const data = doc.data();
    
    return {
      id: doc.id,
      userId: data.userId,
      sojuBottles: data.sojuBottles,
      beerCans: data.beerCans,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  } catch (error) {
    console.error('Error getting drink goal:', error);
    return null;
  }
};

// 일일 음주 기록 관련 함수들
export const createDailyRecord = async (userId: string, date: string, recordData: DailyRecordFormData) => {
  try {
    const recordRef = await addDoc(collection(db, 'dailyRecords'), {
      userId,
      date,
      drank: recordData.drank,
      sojuBottles: recordData.drank ? recordData.sojuBottles || 0 : 0,
      beerCans: recordData.drank ? recordData.beerCans || 0 : 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { id: recordRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

export const updateDailyRecord = async (recordId: string, recordData: DailyRecordFormData) => {
  try {
    const recordRef = doc(db, 'dailyRecords', recordId);
    await updateDoc(recordRef, {
      drank: recordData.drank,
      sojuBottles: recordData.drank ? recordData.sojuBottles || 0 : 0,
      beerCans: recordData.drank ? recordData.beerCans || 0 : 0,
      updatedAt: serverTimestamp(),
    });

    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getDailyRecord = async (userId: string, date: string): Promise<DailyDrinkRecord | null> => {
  try {
    const q = query(
      collection(db, 'dailyRecords'),
      where('userId', '==', userId),
      where('date', '==', date)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    return {
      id: doc.id,
      userId: data.userId,
      date: data.date,
      drank: data.drank,
      sojuBottles: data.sojuBottles,
      beerCans: data.beerCans,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  } catch (error) {
    console.error('Error getting daily record:', error);
    return null;
  }
};

export const getDailyRecords = async (userId: string, startDate: string, endDate: string): Promise<DailyDrinkRecord[]> => {
  try {
    console.log('Getting daily records for user:', userId, 'from', startDate, 'to', endDate);
    
    const q = query(
      collection(db, 'dailyRecords'),
      where('userId', '==', userId),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    console.log('Found', querySnapshot.docs.length, 'records');
    
    const records = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        date: data.date,
        drank: data.drank,
        sojuBottles: data.sojuBottles || 0,
        beerCans: data.beerCans || 0,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    });
    
    console.log('Processed records:', records);
    return records;
  } catch (error) {
    console.error('Error getting daily records:', error);
    return [];
  }
};
