import db from '../database';


interface CategoriesModel {
  markAsRead(jids: number[], uid: number): Promise<void>;
  
  markAsUnreadForAll(jid: number): Promise<void>;
  
  hasReadCategories(jids: number[], uid: number): Promise<boolean[]>;
  
  hasReadCategory(jid: number, uid: number): Promise<boolean>;
}


export default function setupCategoriesModel(Categories: CategoriesModel): void {
  
  Categories.markAsRead = async function (jids: number[], uid: number): Promise<void> {
    
    if (!Array.isArray(jids) || !jids.length || uid < 1) {
      return;
    }
    let keys = jids.map(jid => `jid:${jid}:read_by_uid`);
    const hasRead = await db.isMemberOfSet(keys, uid);
    keys = keys.filter((key, index) => !hasRead[index]);
    await db.setAdd(keys, uid);
  };

  
  
  Categories.hasReadCategories = async function (jids: number[], uid: number): Promise<boolean[]> {
    if (uid < 1) {
      return jids.map(() => false);
    }

    
    const set = jids.map(jid => `jid:${jid}:read_by_uid`);
    return await db.isMemberOfSet(set, uid);
  };

    Categories.markAsUnreadForAll = async function (jid: number): Promise<void> {
    if (!jid) {
      return;
    }
    await db.delete(`jid:${jid}:read_by_uid`);
  };
  
  
  Categories.hasReadCategory = async function (jid: number, uid: number): Promise<boolean> {
    if (uid < 1) {
      return false;
    }


    #another_typeScript_function
    
    return await db.isSetMember(`jid:${jid}:read_by_uid`, uid);
  };
}
