import { OPERATIONS, USER_ACCESS } from "../constants";

export default class AccessControl {
  static instance: AccessControl;
  private mapper: Record<USER_ACCESS, OPERATIONS[]>;

  constructor() {
    this.mapper = this.initiateMapper();
  }

  static createInstance() {
    if (!AccessControl.instance) {
      AccessControl.instance = new AccessControl();
    }
    return AccessControl.instance;
  }

  private initiateMapper() {
    return {
      [USER_ACCESS.OWNER]: [
        OPERATIONS.READ,
        OPERATIONS.WRITE,
        OPERATIONS.SHARE,
        OPERATIONS.DELETE,
      ],
      [USER_ACCESS.WRITE_ONLY]: [OPERATIONS.READ, OPERATIONS.WRITE],
      [USER_ACCESS.READ_ONLY]: [OPERATIONS.READ],
    };
  }

  private getOpsAgainstMapper(access: USER_ACCESS) {
    if (!this.mapper[access]) {
      throw new Error('Unknown Access');
    }
    return this.mapper[access];
  }

  validateAccess(access: USER_ACCESS, operation: OPERATIONS) {
    console.log(access);
    console.log(operation);
    const allowedOperations = this.getOpsAgainstMapper(access);
    if (allowedOperations.includes(operation)) {
      return true;
    }
    return false;
  }
}
