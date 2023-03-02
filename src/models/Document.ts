import { OPERATIONS, USER_ACCESS } from "../constants";
import AccessControl from "./AccessControl";

export default class Document {
  private docName: string;
  private content: string;
  private contentTracker: Map<string, string> = new Map();
  private accessList: Map<string, USER_ACCESS> = new Map();
  private accessControlInstance: AccessControl;
  private createdAt: string;
  private updatedAt: string;

  constructor(documentName: string, createdBy: string) {
    this.docName = documentName;
    this.content = '';
    this.accessControlInstance = AccessControl.createInstance();
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    this.accessList.set(createdBy, USER_ACCESS.OWNER);
  }

  getDocName() {
    return this.docName;
  }

  private setUpdatedAtTrigger() {
    this.updatedAt = new Date().toISOString();
  }

  private contentToString() {
    let data = '';
    for (const key of this.contentTracker.keys()) {
      data += key + '\n';
    }
    this.content = data;
    return data;
  }

  private validate(userId: string, operation: OPERATIONS) {
    if (!this.accessList.has(userId)) {
      throw new Error('User does not have any access');
    }
    const isAuthorised = this.accessControlInstance.validateAccess(
      this.accessList.get(userId) as USER_ACCESS,
      operation
    );
    if (!isAuthorised) {
      throw new Error(`${userId} unauthorised to ${operation.toLowerCase()} the document`);
    }
  }

  getContent(userId: string) {
    const operation = OPERATIONS.READ;

    this.validate(userId, operation);

    return this.content;
  }

  appendContent(content: string, userId: string) {
    const operation = OPERATIONS.WRITE;

    this.validate(userId, operation);

    this.contentTracker.set(content, userId);
    this.content += content;
    this.setUpdatedAtTrigger();
  }

  deleteUsersContent(userId: string, deletedBy: string) {
    const operation = OPERATIONS.DELETE;
    this.validate(deletedBy, operation);

    for (const [key, value] of this.contentTracker.entries()) {
      if (value === userId) {
        this.contentTracker.delete(key);
      }
    }
    this.contentToString();
    this.setUpdatedAtTrigger();
  }

  private provideAccessToUser(
    userId: string,
    access: USER_ACCESS,
    providedBy: string
  ): boolean {
    if (access === USER_ACCESS.OWNER) {
      throw new Error('Cannot provide the access Owner to a user');
    }

    if (this.accessList.get(userId) === USER_ACCESS.OWNER) {
      throw new Error('Owner of the doc cannot be granted a different access');
    }

    const operation = OPERATIONS.SHARE;
    this.validate(providedBy, operation);
    this.accessList.set(userId, access);
    return true;
  }

  revokeUserAccess(userId: string, revokedBy: string) {
    const operation = OPERATIONS.SHARE;
    this.validate(revokedBy, operation);

    if (!this.accessList.has(userId)) {
      return true;
    }
    this.accessList.delete(userId);
    return true;
  }

  setReadAccessToUser(userId: string, providedby: string) {
    const access = USER_ACCESS.READ_ONLY;
    this.provideAccessToUser(userId, access, providedby);
  }
  setWriteAccessToUser(userId: string, providedby: string) {
    const access = USER_ACCESS.WRITE_ONLY;
    this.provideAccessToUser(userId, access, providedby);
  }
}
