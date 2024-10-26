// item.ts
export enum ItemStatus {
    PENDING = 'PENDING', APPROVED = 'APPROVED', REJECTED = 'REJECTED'
  }
  
  // export interface CreateItem {
  //   title: string;
  //   amount: number;
  //   price: number;
  //   contactMobileNo: string;
  //   status: ItemStatus;
  // }
  
  export type CreateItem = Omit<Item, "id">
  
  export type EditIem = CreateItem
  
  export interface Item {
    id: number;
    title: string;
    amount: number;
    price: number;
    contactMobileNo: string;
    status: ItemStatus;
  }